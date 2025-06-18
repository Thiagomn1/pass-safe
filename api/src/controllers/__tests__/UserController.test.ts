import UserController from "../userController";
import User from "../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

jest.mock("../../models/User");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  return res as Response;
};

const next = jest.fn();

describe("UserController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    it("should create a user successfully", async () => {
      const req = {
        body: { username: "testuser", password: "password123" },
      } as Request;
      const res = mockResponse();

      (User.findOne as jest.Mock).mockResolvedValue(null);

      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpassword");

      const mockUserInstance = {
        username: "testuser",
        password: "hashedpassword",
        save: jest.fn().mockResolvedValue(true),
      };

      (User as unknown as jest.Mock).mockImplementation(() => mockUserInstance);

      await UserController.createUser(req, res, next);

      expect(mockUserInstance.save).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User created and logged in successfully",
        user: expect.objectContaining({
          username: "testuser",
        }),
      });
    });

    it("should return 400 if user exists", async () => {
      const req = {
        body: { username: "existinguser", password: "password" },
      } as Request;
      const res = mockResponse();

      (User.findOne as jest.Mock).mockResolvedValue({});

      await UserController.createUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "User already exists",
      });
    });
  });

  describe("loginUser", () => {
    it("should return a token if credentials are valid", async () => {
      const req = {
        body: { username: "test", password: "pass" },
      } as Request;
      const res = mockResponse();

      (User.findOne as jest.Mock).mockResolvedValue({
        username: "test",
        password: "hashedpass",
        _id: "123",
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("token");

      await UserController.loginUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Login successful",
        user: { _id: "123", username: "test", password: "hashedpass" },
      });
    });
  });

  it("should return 401 on invalid credentials", async () => {
    const req = {
      body: { username: "test", password: "wrongpass" },
    } as Request;
    const res = mockResponse();

    (User.findOne as jest.Mock).mockResolvedValue(null);

    await UserController.loginUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid credentials",
    });
  });
});

describe("getMe", () => {
  it("should return the user if found", async () => {
    const req = {
      cookies: { token: "fake-token" },
    } as any;

    const res = mockResponse();
    const next = jest.fn();

    (jwt.verify as jest.Mock).mockReturnValue({ userId: "user123" });

    const mockUser = { username: "test" };

    (User.findById as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser),
    });

    await UserController.getMe(req, res, next);

    expect(res.json).toHaveBeenCalledWith({ username: "test" });
  });

  it("should return 404 if user not found", async () => {
    const req = {
      cookies: { token: "fake-token" },
    } as any;
    const res = mockResponse();
    const next = jest.fn();

    (jwt.verify as jest.Mock).mockReturnValue({ userId: "123" });

    (User.findById as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    await UserController.getMe(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
  });
});
