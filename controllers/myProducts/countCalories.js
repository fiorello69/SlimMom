import Product from "../../models/products.model.js";
import pkg from "http-errors";

const { NotFound } = pkg;
const countCalories = async (productName, productWeight) => {
  const product = await Product.findOne({ title: productName });

  if (!product) {
    NotFound("Product name is not correct");
  }

  const { calories, weight } = product;
  const productCalories = Math.round((calories / weight) * productWeight);

  return productCalories;
};

export default countCalories;
