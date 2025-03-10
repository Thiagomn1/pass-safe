import express from "express";
import UserController from "../controllers/userController";
import authenticate from "../middleware/authenticate";

const routes = express.Router();

routes.get("/myUser", authenticate, UserController.getUser);
routes.post("/signup", UserController.createUser);
routes.post("/login", UserController.loginUser);

export default routes;
