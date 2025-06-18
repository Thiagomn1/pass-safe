import PasswordController from "../passwordController";
import User from "../../models/User";
import { encryptPassword, decryptPassword } from "../../utils/encryption";
import passwordGenerator from "../../utils/passwordGenerator";
import { Request, Response } from "express";

jest.mock("../../models/User");
jest.mock("../../utils/encryption");
jest.mock("../../utils/passwordGenerator");
const next = jest.fn();

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe("PasswordController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getSavedPasswords", () => {
    it("should return decrypted passwords for a user", async () => {
      const req = {
        user: { userId: "123" },
      } as any;
      const res = mockResponse();

      const fakePasswords = [
        { _id: "1", site: "gmail.com", password: "encrypted" },
      ];

      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue({ savedPasswords: fakePasswords }),
      });

      (decryptPassword as jest.Mock).mockReturnValue("decrypted");

      await PasswordController.getSavedPasswords(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        { id: "1", site: "gmail.com", password: "decrypted" },
      ]);
    });

    it("should return 404 if user not found", async () => {
      const req = { user: { userId: "123" } } as any;
      const res = mockResponse();

      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(null),
      });

      await PasswordController.getSavedPasswords(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 500 if an error occurs", async () => {
      const req = { user: { userId: "123" } } as any;
      const res = mockResponse();
      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockRejectedValue(new Error()),
      });
      await PasswordController.getSavedPasswords(req, res, next);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("savePassword", () => {
    it("should save a password and return it", async () => {
      const req = {
        user: { userId: "123" },
        body: { site: "example.com", password: "plainPassword" },
      } as any;

      const res = mockResponse();

      const savedPasswords: any[] = [];

      const fakeUser = {
        savedPasswords,
        save: jest.fn(),
      };

      (User.findById as jest.Mock).mockResolvedValue(fakeUser);
      (encryptPassword as jest.Mock).mockReturnValue("encPassword");

      await PasswordController.savePassword(req, res, next);

      expect(fakeUser.savedPasswords).toEqual([
        { site: "example.com", password: "encPassword" },
      ]);
      expect(fakeUser.save).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: undefined,
        site: "example.com",
        password: "plainPassword",
      });
    });

    it("should return 404 if user not found", async () => {
      const req = {
        user: { userId: "123" },
        body: { site: "example.com", password: "password" },
      } as any;
      const res = mockResponse();

      (User.findById as jest.Mock).mockResolvedValue(null);

      await PasswordController.savePassword(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("should call next with ZodError on invalid input", async () => {
      const req = {
        user: { userId: "123" },
        body: { site: "", password: "" },
      } as any;
      const res = mockResponse();

      await PasswordController.savePassword(req, res, next);

      expect(next).toHaveBeenCalled();
      const errorArg = next.mock.calls[0][0];
      expect(errorArg.name).toBe("ZodError");
      expect(errorArg).toHaveProperty("issues");
    });
  });

  describe("getSitePassword", () => {
    it("should return a site-specific password", async () => {
      const req = {
        user: { userId: "123" },
        params: { site: "netflix" },
      } as any;
      const res = mockResponse();

      const savedPasswords = [
        { site: "netflix.com", password: "enc" },
        { site: "gmail.com", password: "enc2" },
      ];

      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue({ savedPasswords }),
      });

      await PasswordController.getSitePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        site: "netflix.com",
        password: "enc",
      });
    });

    it("should return 404 if no matching password", async () => {
      const req = {
        user: { userId: "123" },
        params: { site: "reddit" },
      } as any;
      const res = mockResponse();

      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue({ savedPasswords: [] }),
      });

      await PasswordController.getSitePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("updateSitePassword", () => {
    it("should update and return the new password", async () => {
      const req = {
        user: { userId: "123" },
        params: { id: "pwd1" },
        body: { password: "newPasswordPlain" },
      } as any;

      const res = mockResponse();

      const passwordEntry = {
        _id: "pwd1",
        site: "netflix.com",
        password: "oldEnc",
      };

      const savedPasswords = {
        id: (id: string) => (id === passwordEntry._id ? passwordEntry : null),
      };

      const fakeUser = {
        savedPasswords,
        save: jest.fn(),
      };

      (User.findById as jest.Mock).mockResolvedValue(fakeUser);
      (encryptPassword as jest.Mock).mockReturnValue("newEncrypted");

      await PasswordController.updateSitePassword(req, res, next);

      expect(passwordEntry.password).toBe("newEncrypted");
      expect(fakeUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        site: "netflix.com",
        message: "Password updated successfully.",
      });
    });

    it("should return 404 if password entry not found", async () => {
      const req = {
        user: { userId: "123" },
        params: { id: "notfound" },
        body: { password: "newPass" },
      } as any;
      const res = mockResponse();

      const savedPasswords = {
        id: (_id: string) => null,
      };

      const fakeUser = {
        savedPasswords,
        save: jest.fn(),
      };

      (User.findById as jest.Mock).mockResolvedValue(fakeUser);

      await PasswordController.updateSitePassword(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Password entry not found.",
      });
    });

    it("should return 404 if user not found", async () => {
      const req = {
        user: { userId: "123" },
        params: { id: "pwd1" },
        body: { password: "newPass" },
      } as any;
      const res = mockResponse();

      (User.findById as jest.Mock).mockResolvedValue(null);

      await PasswordController.updateSitePassword(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });
  });

  describe("deleteSitePassword", () => {
    const mockResponse = () => {
      const res: any = {};
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      return res;
    };

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should delete a password for the given id", async () => {
      const pullMock = jest.fn();
      const saveMock = jest.fn();

      const savedPasswords = {
        id: (id: string) =>
          id === "abc123"
            ? { _id: "abc123", site: "netflix.com", password: "encrypted" }
            : null,
        pull: pullMock,
      };

      const mockUser = {
        savedPasswords,
        save: saveMock,
      };

      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      const req = {
        user: { userId: "user123" },
        params: { id: "abc123" },
      } as any;

      const res = mockResponse();

      await PasswordController.deleteSitePassword(req, res, next);

      expect(User.findById).toHaveBeenCalledWith("user123");
      expect(pullMock).toHaveBeenCalledWith("abc123");
      expect(saveMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Password entry deleted.",
      });
    });

    it("should return 404 if user not found", async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      const req = {
        user: { userId: "123" },
        params: { id: "someId" },
      } as any;

      const res = mockResponse();

      await PasswordController.deleteSitePassword(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("should return 404 if password entry not found", async () => {
      const savedPasswords = {
        id: () => null,
        pull: jest.fn(),
      };

      const mockUser = {
        savedPasswords,
        save: jest.fn(),
      };

      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      const req = {
        user: { userId: "123" },
        params: { id: "nonexistentId" },
      } as any;

      const res = mockResponse();

      await PasswordController.deleteSitePassword(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Password entry not found.",
      });
    });

    it("should return 400 if site param is missing or invalid", async () => {
      const req = {
        user: { userId: "123" },
        params: { site: "" },
      } as any;

      const res = mockResponse();

      await PasswordController.deleteSitePassword(req, res, next);

      expect(next).toHaveBeenCalled();
      const errorArg = next.mock.calls[0][0];
      expect(errorArg).toHaveProperty("issues");
      expect(errorArg.name).toBe("ZodError");
    });
  });
});
