import express from "express";

import mongoose from "mongoose";

import { registrationValidator } from "./validations/auth.js";

import checkAuth from "./utils/checkAuth.js";

import * as UserController from "./controllers/UserController.js";

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

app.post("/auth/login", UserController.authentification);

app.post("/auth/register", registrationValidator, UserController.registration);

app.get("/auth/profile", checkAuth, UserController.getProfile);

app.listen(3333, (error) => {
  if (error) {
    return console.log(error);
  }

  console.log("okay okay it runs well");
});
