import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const app = express();

mongoose
  .connect(
    "mongodb+srv://admin:admin@cluster0.hws3uum.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connected okay");
  })
  .catch(() => {
    console.log("not connected, error");
  });

app.use(express.json());

app.post("/auth/register", (request, response) => {
  
});

app.listen(3333, (error) => {
  if (error) {
    return console.log(error);
  }

  console.log("okay okay it runs well");
});
