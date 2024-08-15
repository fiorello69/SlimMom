import Product from "../../models/products.model.js";

const getNotAllowedProducts = async (bloodType) => {
  const blood = [null, false, false, false, false];
  blood[bloodType] = true;
  const products = Product.find({
    groupBloodNotAllowed: { $all: [blood] },
  });
  return products;
};

export default getNotAllowedProducts;
