import express from "express";
import UserController from "../controllers/userController";
import authenticate from "../middleware/authenticate";
import { validate } from "../middleware/validate";
import { userSchema } from "../validation/userSchemas";

const routes = express.Router();

routes.get("/me", authenticate, UserController.getMe);
routes.post("/signup", validate(userSchema), UserController.createUser);
routes.post("/login", validate(userSchema), UserController.loginUser);
routes.post("/logout", authenticate, UserController.logoutUser);
routes.patch("/update", authenticate, UserController.updateUser);

export default routes;
