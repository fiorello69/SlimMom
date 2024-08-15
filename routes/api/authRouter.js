import express from "express";
import ctrlWrapper from "../../middlewares/ctrlWrapper.js";
import validation from "../../middlewares/validation.js";
import auth from "../../middlewares/auth.js";
import {
  joiUpdateDailyRateSchema,
  joiSignupSchema,
  joiLoginSchema,
} from "../../middlewares/validationSchemas.js";
import { users as ctrl } from "../../controllers/users/index.js";

const router = express.Router();

router.post("/signup", validation(joiSignupSchema), ctrlWrapper(ctrl.signup));
router.post("/login", validation(joiLoginSchema), ctrlWrapper(ctrl.login));
router.get("/current", auth, ctrlWrapper(ctrl.getCurrent));
router.put(
  "/infouser",
  auth,
  validation(joiUpdateDailyRateSchema),
  ctrlWrapper(ctrl.updateById)
);
router.post("/logout", auth, ctrlWrapper(ctrl.logout));

export default router;
