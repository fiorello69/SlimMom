import pkg from "http-errors";
import { hashSync, genSaltSync } from "bcrypt";
import User from "../../models/user.model.js";
const { Conflict } = pkg;
const signup = async (req, res) => {
  const {
    name,
    email,
    password,
    currentWeight,
    height,
    age,
    desiredWeight,
    bloodType,
    dailyRate,
    notAllowedProducts,
    notAllowedProductsAll,
  } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new Conflict(`User with ${email} already exist`);
  }

  const hashPassword = hashSync(password, genSaltSync(10));
  const result = await User.create({
    name,
    email,
    password: hashPassword,
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
  });

  res.status(201).json({
    status: "success",
    code: 201,
    data: {
      user: {
        email: result.email,
        name: result.name,
        infouser: {
          currentWeight: currentWeight,
          height: height,
          age: age,
          desiredWeight: desiredWeight,
          bloodType: bloodType,
          dailyRate: dailyRate,
          notAllowedProductsAll: notAllowedProductsAll,
        },
      },
    },
  });
};

export default signup;
