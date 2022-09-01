import { body } from "express-validator";

export const registrationValidator = [
  body("email", "Incorrect email format").isEmail(),
  body("password", "Password has to be of a minimum length of 5 symbols").isLength({ min: 5 }),
  body("fullName", "Name should contain at least 3 symbols").isLength({ min: 3 }),
  body("avatarUrl", "Please provide a correct image url").optional().isURL(),
];
