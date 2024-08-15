import { Schema, model } from "mongoose";

const productSchema = new Schema({
  categories: [{ type: String }],
  weight: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
    index: "text",
  },
  calories: {
    type: Number,
    required: true,
  },
  groupBloodNotAllowed: {
    1: { type: Boolean, required: true },
    2: { type: Boolean, required: true },
    3: { type: Boolean, required: true },
    4: { type: Boolean, required: true },
  },
});

const Product = model("product", productSchema);

export default Product;
