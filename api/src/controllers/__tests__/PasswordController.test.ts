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
        { site: "gmail.com", password: "decrypted" },
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

  describe("generatePassword", () => {
    it("should create a password and return it", async () => {
      const req = {
        user: { userId: "123" },
        body: { length: 10, site: "example.com" },
      } as any;
      const res = mockResponse();

      const fakeUser = {
        savedPasswords: [],
        save: jest.fn(),
      };

      (User.findById as jest.Mock).mockResolvedValue(fakeUser);
      (passwordGenerator as jest.Mock).mockReturnValue("genPassword");
      (encryptPassword as jest.Mock).mockReturnValue("encPassword");

      await PasswordController.generatePassword(req, res, next);

      expect(fakeUser.savedPasswords).toEqual([
        { site: "example.com", password: "encPassword" },
      ]);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        site: "example.com",
        password: "genPassword",
      });
    });

    it("should call next with ZodError on invalid length", async () => {
      const req = {
        body: { length: -1, site: "example.com" },
        user: { userId: "123" },
      } as any;

      const res = mockResponse();
      const next = jest.fn();

      await PasswordController.generatePassword(req, res, next);

      expect(next).toHaveBeenCalled();
      const errorArg = next.mock.calls[0][0];
      expect(errorArg).toHaveProperty("issues");
      expect(errorArg.name).toBe("ZodError");
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
        body: { site: "netflix", length: 12 },
      } as any;
      const res = mockResponse();

      const passwordEntry = { site: "netflix.com", password: "oldEnc" };
      const fakeUser = {
        savedPasswords: [passwordEntry],
        save: jest.fn(),
      };

      (User.findById as jest.Mock).mockResolvedValue(fakeUser);
      (passwordGenerator as jest.Mock).mockReturnValue("newPassword");
      (encryptPassword as jest.Mock).mockReturnValue("newEncrypted");

      await PasswordController.updateSitePassword(req, res, next);

      expect(passwordEntry.password).toBe("newEncrypted");
      expect(fakeUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        site: "netflix.com",
        newPassword: "newPassword",
      });
    });

    it("should return 404 if site not found", async () => {
      const req = {
        user: { userId: "123" },
        body: { site: "reddit", length: 10 },
      } as any;
      const res = mockResponse();

      (User.findById as jest.Mock).mockResolvedValue({
        savedPasswords: [],
        save: jest.fn(),
      });

      await PasswordController.updateSitePassword(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
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

    it("should delete a password for the given site", async () => {
      const mockSave = jest.fn();
      const pull = jest.fn();

      const savedPasswords = [
        { _id: "abc123", site: "netflix.com", password: "encrypted" },
        { _id: "def456", site: "gmail.com", password: "encrypted2" },
      ];

      (savedPasswords as any).pull = jest.fn();

      const mockUser = {
        savedPasswords: Object.assign([...savedPasswords], { pull }),
        save: mockSave,
      };

      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      const req = {
        user: { userId: "123" },
        params: { site: "netflix" },
      } as any;

      const res = mockResponse();

      await PasswordController.deleteSitePassword(req, res, next);

      expect(User.findById).toHaveBeenCalledWith("123");
      expect(pull).toHaveBeenCalledWith("abc123");
      expect(mockSave).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Password for 'netflix' deleted.",
      });
    });

    it("should return 404 if user not found", async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      const req = {
        user: { userId: "123" },
        params: { site: "netflix" },
      } as any;

      const res = mockResponse();

      await PasswordController.deleteSitePassword(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("should return 404 if site not found", async () => {
      const savedPasswords = [
        { _id: "def456", site: "gmail.com", password: "encrypted2" },
      ];

      (savedPasswords as any).pull = jest.fn();

      const mockUser = {
        savedPasswords: savedPasswords as any,
        save: jest.fn(),
      };

      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      const req = {
        user: { userId: "123" },
        params: { site: "netflix" },
      } as any;

      const res = mockResponse();

      await PasswordController.deleteSitePassword(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Password for site not found.",
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
