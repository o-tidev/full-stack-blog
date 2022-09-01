import { body } from "express-validator";

export const registrationValidator = [
  body("email", "Incorrect email format").isEmail(),
  body("password", "Password has to be of a minimum length of 5 symbols").isLength({ min: 5 }),
  body("fullName", "Name should contain at least 3 symbols").isLength({ min: 3 }),
  body("avatarUrl", "Please provide a correct image url").optional().isURL(),
];

export const loginValidator = [
  body("email", "Incorrect email format").isEmail(),
  body("password", "Password has to be of a minimum length of 5 symbols").isLength({ min: 5 }),
];

export const postCreateValidator = [
  body("title", "Enter a title for your post").isLength({ min: 3 }).isString(),
  body("description", "Enter the description of your post").isLength({ min: 10 }).isString(),
  body("tags", "Incorrect tag format").optional().isString(),
  body("imageUrl", "Incorrect image URL").optional().isString(),
];
