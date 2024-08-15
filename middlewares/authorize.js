const jwt = require("jsonwebtoken");
require("dotenv").config();

const { User } = require("../models/user");
const { Session } = require("../models/session");

const { ACCESS_TOKEN_KEY } = process.env;

const authorize = async (req, res, next) => {
  const authorizationHeader = req.get("Authorization");
  if (authorizationHeader) {
    const accessToken = authorizationHeader.replace("Bearer ", "");
    try {
      const payload = jwt.verify(accessToken, ACCESS_TOKEN_KEY);
      const user = await User.findById(payload.id);
      const session = await Session.findOne({ uid: user._id });

      if (!user) {
        return res.status(404).send({ message: "Invalid user" });
      }
      if (!session) {
        return res.status(404).send({ message: "Invalid session" });
      }
      req.user = user;
      req.session = session;
      next();
    } catch (err) {
      return res.status(401).send({ message: "Unauthorized" });
    }
  } else {
    return res.status(400).send({ message: "No token provided" });
  }
};

module.exports = authorize;
