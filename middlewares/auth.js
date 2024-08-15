import pkg from "http-errors";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import "dotenv/config";

const { JWT_SECRET } = process.env;
const { Unauthorized } = pkg;
const { verify } = jwt;

const auth = async (req, _res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer" || !token) {
    return next(new Unauthorized("Not authorized"));
  }

  try {
    const decoded = verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    console.log("Token Decoded:", decoded);
    console.log("Current Time:", Math.floor(Date.now() / 1000));
    console.log("Token Expiration Time:", decoded.exp);

    if (!user || !user.token || user.token !== token) {
      throw new Unauthorized("Not authorized");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      error.status = 401;
    } else if (error.name === "TokenExpiredError") {
      error.status = 401;
      error.message = "Token expired";
    }
    next(error);
  }
};

export default auth;
