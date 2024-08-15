import pkg from "http-errors";
import jwt from "jsonwebtoken";
import User from "../../models/user.model.js";
import "dotenv/config";

const { JWT_SECRET } = process.env;
const { Unauthorized } = pkg;
const { sign } = jwt;
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const { name, infouser } = user;
  if (!user || !user.comparePassword(password)) {
    throw new Unauthorized("Email or password is wrong");
  }
  const payload = {
    id: user._id,
  };
  const token = sign(payload, JWT_SECRET, { expiresIn: "1h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    status: "success",
    code: 200,
    data: {
      token,
      name,
      infouser,
    },
  });
};

export default login;
