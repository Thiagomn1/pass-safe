import express from "express";
import PasswordController from "../controllers/passwordController";
import authenticate from "../middleware/authenticate";
import { validate } from "../middleware/validate";
import {
  generatePasswordSchema,
  updatePasswordSchema,
  siteParamSchema,
} from "../validation/passwordSchemas";

const routes = express.Router();

routes.use(authenticate);

routes.get("/", PasswordController.getSavedPasswords);

routes.get(
  "/:site",
  validate(siteParamSchema),
  PasswordController.getSitePassword
);

routes.post(
  "/generate",
  validate(generatePasswordSchema),
  PasswordController.generatePassword
);

routes.put(
  "/update",
  validate(updatePasswordSchema),
  PasswordController.updateSitePassword
);

routes.delete(
  "/:site",
  validate(siteParamSchema),
  PasswordController.deleteSitePassword
);
export default routes;
