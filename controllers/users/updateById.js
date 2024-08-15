import pkg from "http-errors";
import User from "../../models/user.model.js";
const { NotFound } = pkg;
const updateById = async (req, res) => {
  const { _id } = req.user;
  const {
    currentWeight,
    height,
    age,
    desiredWeight,
    bloodType,
    dailyRate,
    notAllowedProducts,
    notAllowedProductsAll,
  } = req.body;
  const result = await User.findByIdAndUpdate(
    _id,
    {
      infouser: {
        currentWeight,
        height,
        age,
        desiredWeight,
        bloodType,
        dailyRate,
        notAllowedProducts,
        notAllowedProductsAll,
      },
    },
    { new: true }
  );
  if (!result) {
    throw new NotFound("Not found");
  }
  res.json({
    status: "success",
    code: 200,
    data: {
      result,
    },
  });
};

export default updateById;
