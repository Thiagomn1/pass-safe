import express from "express";
import PasswordController from "../controllers/passwordController";

const routes = express.Router();

routes.get("/generate", PasswordController.generatePassword);

export default routes;
