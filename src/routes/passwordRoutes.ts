import express from "express";
import PasswordController from "../controllers/passwordController";
import authenticate from "../middleware/authenticate";
import checkAuthenticated from "../middleware/checkAuthenticated";

const routes = express.Router();

routes.use(authenticate);

routes.get("/", checkAuthenticated, PasswordController.getSavedPasswords);
routes.post(
  "/generate",
  checkAuthenticated,
  PasswordController.generatePassword
);

export default routes;
