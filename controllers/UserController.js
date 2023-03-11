import UserModel from "../models/userModel.js";
import { ObjectId } from "mongodb";
// import bcrypt from "bcrypt";
// import jwt from 'jsonwebtoken'

// ------------------
// Get all users
// ------------------
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};

// ------------------
// Get a User
// ------------------
export const getUser = async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send("Unknown ID : " + id);
  }

  try {
    const user = await UserModel.findById(id).select("-password");
    if (!user) {
      return res.status(404).json("Unknown ID : " + id);
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

// ------------------
// udpate a user
// ------------------
export const updateUser = async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send("Unknown ID : " + id);
  }
  try {
    const updateUser = await UserModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          bio: req.body.bio,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    if (!updateUser) {
      return res.status(404).json("Unknown ID : " + id);
    }
    res.status(200).json(updateUser);
  } catch (err) {
    res.status(500).json(err);
  }
};

// ------------------
// Delete a user
// ------------------
export const deleteUser = async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send("Unknown ID : " + id);
  }
  try {
    const deleteUser = await UserModel.findByIdAndDelete(id);
    res.status(200).json("User deleted successfully");
  } catch (err) {
    res.status(500).json(err);
  }
};

// --------------------
// Follow a User
// --------------------
export const follow = async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id) || !ObjectId.isValid(req.body.idToFollow)) {
    return res.status(400).send("Unknown ID : " + id);
  }
  try {
    // add to the followers list of the user
    const follower = await UserModel.findByIdAndUpdate(
      id,
      {
        $addToSet: { following: req.body.idToFollow },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    if (!follower) {
      return res.status(404).json("Unknown ID : " + id);
    }

    // add to the following list of the user
    const following = await UserModel.findByIdAndUpdate(
      req.body.idToFollow,
      {
        $addToSet: { followers: id },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    if (!following) {
      return res.status(404).json("Unknown ID : " + id);
    }

    // send the response after both operations are done
    res.status(200).json("Followed Successfully!");
  } catch (err) {
    res.status(500).json(err);
  }
};

// -----------------------
// Unfollow a User
// -----------------------
export const unfollow = async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id) || !ObjectId.isValid(req.body.idToUnfollow)) {
    return res.status(400).send("Unknown ID : " + id);
  }
  try {
    // remove to the followers list of the user
    const unfollower = await UserModel.findByIdAndUpdate(
      id,
      {
        $pull: { following: req.body.idToUnfollow },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    if (!unfollower) {
      return res.status(404).json("Unknown ID : " + id);
    }

    // remove to the following list of the user
    const unfollowing = await UserModel.findByIdAndUpdate(
      req.body.idToUnfollow,
      {
        $pull: { followers: id },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    if (!unfollowing) {
      return res.status(404).json("Unknown ID : " + id);
    }

    // send the response after both operations are done
    return res.status(200).json("Unfollowed Successfully!");
  } catch (err) {
    return res.status(500).json(err);
  }
};
