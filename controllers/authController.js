const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { Summary } = require("../models/summary");
const { User } = require("../models/user");
const { Session } = require("../models/session");
const { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } = process.env;
const { RequestError } = require("../helpers");

const register = async (req, res) => {
  const { username, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw RequestError(409, "Email in use");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username,
    email,
    passwordHash,
    userData: {
      weight: 0,
      height: 0,
      age: 0,
      bloodType: 0,
      desiredWeight: 0,
      dailyRate: 0,
      notAllowedProducts: [],
    },
    days: [],
  });

  res.status(201).send({
    username: newUser.username,
    email: newUser.email,
    id: newUser._id,
  });
};
const login = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(401).send({ message: "Invalid email or password" });
    }

    const passwordCompare = await bcrypt.compare(password, user.passwordHash);
    if (!passwordCompare) {
      console.log("Password comparison failed");
      return res.status(401).send({ message: "Invalid email or password" });
    }

    const payload = { id: user._id };
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_KEY, {
      expiresIn: "8h",
    });
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_KEY, {
      expiresIn: "24h",
    });

    console.log("Access token:", accessToken);
    console.log("Refresh token:", refreshToken);

    const newSession = await Session.create({ uid: user._id });

    const today = new Date().toISOString().split("T")[0];
    const todaySummary = await Summary.findOne({ date: today });

    res.status(200).send({
      accessToken,
      refreshToken,
      sid: newSession._id,
      todaySummary: todaySummary || {},
      user: {
        email: user.email,
        username: user.username,
        userData: user.userData,
        id: user._id,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const refresh = async (req, res) => {
  const user = req.user;
  await Session.deleteMany({ uid: user._id });
  const payload = { id: user._id };
  const newSession = await Session.create({ uid: user._id });
  const newAccessToken = jwt.sign(payload, ACCESS_TOKEN_KEY, {
    expiresIn: "8h",
  });
  const newRefreshToken = jwt.sign(payload, REFRESH_TOKEN_KEY, {
    expiresIn: "24h",
  });

  return res
    .status(200)
    .send({ newAccessToken, newRefreshToken, sid: newSession._id });
};

const logout = async (req, res) => {
  const authorizationHeader = req.get("Authorization");
  if (authorizationHeader) {
    const accessToken = authorizationHeader.replace("Bearer ", "");
    try {
      const payload = jwt.verify(accessToken, ACCESS_TOKEN_KEY);
      const user = await User.findById(payload.id);
      await Session.findOneAndDelete({ uid: user._id });
      return res.status(204).json({ message: "Logout successful" });
    } catch (err) {
      return res.status(401).send({ message: "Unauthorized" });
    }
  } else {
    return res.status(204).json({ message: "Logout successful" });
  }
};

const deleteUserController = async (req, res) => {
  const { userId } = req.params;
  await User.findOneAndDelete({ _id: userId });
  const currentSession = req.session;
  await Session.deleteOne({ _id: currentSession._id });
  res.status(200).json({ message: "User deleted" });
};

const getUserController = async (req, res) => {
  const { _id } = req.user;
  const result = await User.findOne({ _id });
  res.status(200).json(result);
};

module.exports = {
  register,
  login,
  logout,
  deleteUserController,
  refresh,
  getUserController,
};
