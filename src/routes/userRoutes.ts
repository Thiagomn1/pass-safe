import express from "express";
import UserController from "../controllers/userController";
import authenticate from "../middleware/authenticate";
import { validate } from "../middleware/validate";
import { userSchema } from "../validation/userSchemas";

const routes = express.Router();

routes.get(
  "/myUser",
  authenticate,
  validate(userSchema),
  UserController.getUser
);
routes.post("/signup", validate(userSchema), UserController.createUser);
routes.post("/login", validate(userSchema), UserController.loginUser);

export default routes;
