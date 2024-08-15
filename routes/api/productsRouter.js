import express from "express";
import auth from "../../middlewares/auth.js";
import validation from "../../middlewares/validation.js";
import ctrlWrapper from "../../middlewares/ctrlWrapper.js";
import { joiGetDailyRateSchema } from "../../middlewares/validationSchemas.js";
import { products as ctrl } from "../../controllers/products/productsController.js";
const router = express.Router();

router.post(
  "/",
  validation(joiGetDailyRateSchema),
  ctrlWrapper(ctrl.getDailyRateController)
);
router.post("/:userId", auth, ctrlWrapper(ctrl.getDailyRateUserController));
router.get("/searchProducts", ctrlWrapper(ctrl.getAllProductsByQuery));

export default router;
