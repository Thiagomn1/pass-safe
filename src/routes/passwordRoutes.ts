import express from "express";
import PasswordController from "../controllers/passwordController";
import authenticate from "../middleware/authenticate";

const routes = express.Router();

routes.get("/", authenticate, PasswordController.getSavedPasswords);
routes.post("/generate", authenticate, PasswordController.generatePassword);

export default routes;
