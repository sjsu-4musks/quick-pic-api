const express = require("express");
const crypto = require("crypto");

const router = express.Router();

const UsersModel = require("../../../models/Users");
const { UserRoles } = require("../../../constants/Users");
const { createSalt, hashPassword, encodeJWT } = require("../../../utils/jwt");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../../constants/App");
const logger = require("../../../utils/logger");

router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName) {
      return res
        .status(400)
        .json({ success: false, message: "First name is required." });
    }

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required." });
    }

    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Password is required." });
    }

    const user = await UsersModel.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User with email already exists. Please sign in."
      });
    }

    const hashedPassword = hashPassword(password, createSalt());

    const newUser = await new UsersModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: UserRoles.ADMIN,
      avatar: crypto
        .createHash("md5")
        .update(email)
        .digest("hex")
    }).save();

    return res.status(200).json({
      success: true,
      data: {
        user: newUser,
        token: encodeJWT({ userId: newUser._id })
      }
    });
  } catch (error) {
    logger.error("POST /api/v1/users/signup -> error : ", error);
    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required." });
    }

    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Password is required." });
    }

    const user = await UsersModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "User with email does not exist. Please check your credentials and try again."
      });
    }

    const salt = user.password.split("$")[0];

    const hashedPassword = hashPassword(password, salt);

    if (hashedPassword !== user.password) {
      return res.status(403).json({
        success: false,
        message: "Incorrect password. Please try again."
      });
    }

    const token = encodeJWT({ userId: user._id });

    return res.status(200).json({ success: true, data: { user, token } });
  } catch (error) {
    logger.error("POST /api/v1/users/signin/email -> error : ", error);
    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

module.exports = router;
