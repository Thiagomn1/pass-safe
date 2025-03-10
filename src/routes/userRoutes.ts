import express from "express";
import UserController from "../controllers/userController";
import authenticate from "../middleware/authenticate";
import checkAuthenticated from "../middleware/checkAuthenticated";

const routes = express.Router();

routes.get("/myUser", authenticate, checkAuthenticated, UserController.getUser);
routes.post("/signup", UserController.createUser);
routes.post("/login", UserController.loginUser);

export default routes;
