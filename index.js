import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { validationResult } from "express-validator";

import { registrationValidator } from "./validations/auth.js";

import UserModel from "./models/User.js";
import checkAuth from "./utils/checkAuth.js";

mongoose
  .connect(
    "mongodb+srv://admin:admin@cluster0.fle0080.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connected okay");
  })
  .catch(() => {
    console.log("not connected, error");
  });

const app = express();

app.use(express.json());

app.post("/auth/login", async (request, response) => {
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
});

app.post("/auth/register", registrationValidator, async (request, response) => {
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
});

app.get("/auth/profile", checkAuth, async (request, response) => {
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
});

app.listen(3333, (error) => {
  if (error) {
    return console.log(error);
  }

  console.log("okay okay it runs well");
});
