const jwt = require("jsonwebtoken");
require("dotenv").config();

const { User } = require("../models/user");
const { Session } = require("../models/session");

const { REFRESH_TOKEN_KEY } = process.env;

const authenticateRefresh = async (req, res, next) => {
  const sidReq = req.body.sid;
  const authorizationHeader = req.get("Authorization");
  if (authorizationHeader) {
    const refreshToken = authorizationHeader.replace("Bearer ", "");
    try {
      const payload = jwt.verify(refreshToken, REFRESH_TOKEN_KEY);
      const user = await User.findById(payload.id);
      const sessionUser = await Session.findOne({ uid: user._id });
      const sessionReq = await Session.findOne({ _id: sidReq });

      if (!user) {
        return res.status(404).send({ message: "Invalid user" });
      }
      if (!sessionReq || !sessionUser) {
        return res.status(404).send({ message: "Invalid session" });
      }
      req.user = user;
      req.session = sessionReq;
      next();
    } catch (err) {
      return res.status(401).send({ message: "Unauthorized" });
    }
  } else {
    return res.status(400).send({ message: "No token provided" });
  }
};

module.exports = authenticateRefresh;
