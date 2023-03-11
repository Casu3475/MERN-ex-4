import UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { signUpErrors, signInErrors } from "../utils/errors.utils.js";

const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

// ---------------------------------
// Register a new user - Sign Up
// ---------------------------------
export const registerUser = async (req, res) => {
  // console.log(req.body);
  const { pseudo, email, password } = req.body; // destructuring
  try {
    const user = await UserModel.create({ pseudo, email, password });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = signUpErrors(err);
    // res.status(200).send({ err})
    res.status(200).send({ errors });
  }
};

// ---------------------------------
// Login User - Sign In
// ---------------------------------
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge,
    });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = signInErrors(err);
    res.status(400).json({ errors });
  }
};

// ---------------------------------
// Logout User
// ---------------------------------
export const logoutUser = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
