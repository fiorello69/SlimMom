import express from "express";
import auth from "../../middlewares/auth.js";
import validation from "../../middlewares/validation.js";
import ctrlWrapper from "../../middlewares/ctrlWrapper.js";
import {
  joiAddMyProductSchema,
  joiDeleteMyProductSchema,
  joiGetMyProductSchema,
} from "../../middlewares/validationSchemas.js";
import { myProducts as ctrl } from "../../controllers/myProducts/index.js";

const router = express.Router();

router.use(auth);
router.post(
  "/addProduct",
  validation(joiAddMyProductSchema),
  ctrlWrapper(ctrl.addMyProducts)
);
router.delete(
  "/:productId",
  validation(joiDeleteMyProductSchema),
  ctrlWrapper(ctrl.deleteMyProducts)
);
router.post(
  "/listMyProduct",
  validation(joiGetMyProductSchema),
  ctrlWrapper(ctrl.getMyProducts)
);

export default router;
