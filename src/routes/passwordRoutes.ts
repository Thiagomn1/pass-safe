import express from "express";
import PasswordController from "../controllers/passwordController";
import authenticate from "../middleware/authenticate";

const routes = express.Router();

routes.post("/generate", authenticate, PasswordController.generatePassword);

export default routes;
