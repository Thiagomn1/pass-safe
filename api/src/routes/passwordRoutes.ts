import express from "express";
import PasswordController from "../controllers/passwordController";
import authenticate from "../middleware/authenticate";
import { validate } from "../middleware/validate";
import {
  generatePasswordSchema,
  updatePasswordSchema,
  siteParamSchema,
  savePasswordParseSchema,
  savePasswordSchema,
} from "../validation/passwordSchemas";

const routes = express.Router();

routes.use(authenticate);

routes.get("/", PasswordController.getSavedPasswords);
routes.get(
  "/:site",
  validate(siteParamSchema),
  PasswordController.getSitePassword
);
routes.get(
  "/generate",
  validate(generatePasswordSchema),
  PasswordController.generatePassword
);
routes.post("/", validate(savePasswordSchema), PasswordController.savePassword);
routes.put(
  "/:site",
  validate(updatePasswordSchema),
  PasswordController.updateSitePassword
);
routes.delete(
  "/:id",
  validate(siteParamSchema),
  PasswordController.deleteSitePassword
);
export default routes;
