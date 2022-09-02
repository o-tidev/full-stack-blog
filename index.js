import express from "express";
import multer from "multer";
import mongoose from "mongoose";

import {
  registrationValidator,
  loginValidator,
  postCreateValidator,
} from "./validations.js";

import checkAuth from "./utils/checkAuth.js";

import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";

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

const storage = multer.diskStorage({
  destination: (_, __, callback) => {
    callback(null, "uploads");
  },
  filename: (_, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.post("/auth/login", loginValidator, UserController.authentification);
app.post("/auth/register", registrationValidator, UserController.registration);
app.get("/auth/profile", checkAuth, UserController.getProfile);

app.post("/upload", checkAuth, upload.single("image"), (request, response) => {
  response.json({
    url: `/uploads/${request.file.originalname}`,
  });
});

app.post("/posts", checkAuth, postCreateValidator, PostController.create);
app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch("/posts/:id", checkAuth, postCreateValidator, PostController.update);

app.listen(3333, (error) => {
  if (error) {
    return console.log(error);
  }

  console.log("okay okay it runs well");
});
