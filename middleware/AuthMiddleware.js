import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";
// import dotenv from "dotenv";

// dotenv.config();
export const checkUser = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_KEY, async (err, decodedToken) => {
      if (err) {
        // console.log(err.message);
        res.locals.user = null; // locals is a temporary variable
        res.cookie("jwt", "", { maxAge: 1 });
        next();
      } else {
        // console.log("decodedToken " + decodedToken);
        let user = await UserModel.findById(decodedToken.id);
        res.locals.user = user;
        // console.log("res.locals.user " + res.locals.user);
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

// check if the token correspponds to the user from the database
export const requiredAuth = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_KEY, async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log(decodedToken.id);
        next();
      }
    });
  } else {
    console.log("No token");
  }
};
