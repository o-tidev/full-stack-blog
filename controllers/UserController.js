import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { validationResult } from "express-validator";

import UserModel from "../models/User.js";


export const registration = async (request, response) => {
  try {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json(errors.array());
    }

    const password = request.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const document = new UserModel({
      email: request.body.email,
      passwordHash: hash,
      fullName: request.body.fullName,
      avatarUrl: request.body.avatarUrl,
    });

    const user = await document.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      test12345,
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    response.json(...userData, token);
  } catch (error) {
    response.status(500).json({
      message: "Couldn't register",
      error: error,
    });
  }
};

export const authentification = async (request, response) => {
  try {
    const user = await UserModel.findOne({ email: request.body.email });

    if (!user) {
      return response.status(400).json({
        message: "Incorrect email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      request.body.password,
      user._doc.passwordHash
    );

    if (!isPasswordValid) {
      return response.status(400).json({
        message: "Incorrect login or password",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "kottinov",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    response.json({ ...userData, token });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: "Couldn't log in :(",
    });
  }
};

export const getProfile = async (request, response) => {
  try {
    const user = await UserModel.findById(request.userId);
    if (!user) {
      return response.status(404).json({
        message: "User not found",
      });
    }

    const { passwordHash, ...userData } = user._doc;

    response.json({ userData });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: "No access",
    });
  }
};
