import PostModel from "../models/postModel.js";
import UserModel from "../models/userModel.js";
import { ObjectId } from "mongodb";
// import bcrypt from "bcrypt";
// import jwt from 'jsonwebtoken'

// ------------------
// Create a Post
// ------------------
export const createPost = async (req, res) => {
  const newPost = new PostModel({
    posterId: req.body.posterId,
    message: req.body.message,
    // picture: req.body.picture,
    video: req.body.video,
    likers: [],
    comments: [],
  });
  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json(error);
  }
};

// ------------------
// Get a Post
// ------------------
export const readPost = async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 }); // sort by date
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error);
  }
};

// ------------------
// udpate a post
// ------------------
export const updatePost = async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send("Invalid ID : " + id);
  }
  try {
    const updatedPost = await PostModel.findByIdAndUpdate(
      id,
      {
        message: req.body.message,
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );
    console.log("Updated Post : ", updatedPost);
    res.status(200).json(updatedPost);
  } catch (err) {
    console.log("Error updating Post : ", err);
    res.status(500).json(err);
  }
};

// ------------------
// Delete a post
// ------------------
export const deletePost = async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send(" ID : " + id);
  }
  try {
    await PostModel.findByIdAndRemove(id);
    res.status(200).json("Post deleted");
  } catch (err) {
    console.log("Error deleting Post : ", err);
    res.status(500).json(err);
  }
};

// --------------------
// Like a Post
// --------------------
export const likePost = async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send("Unknown ID : " + id);
  }

  try {
    await PostModel.findByIdAndUpdate(
      id,
      {
        $addToSet: { likers: req.body.id },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    await UserModel.findByIdAndUpdate(
      req.body.id,
      {
        $addToSet: { likes: id },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json("Post liked");
  } catch (err) {
    console.log("Error liking Post : ", err);
    res.status(500).json(err);
  }
};

// -----------------------
// Unlike a post
// -----------------------
export const unlikePost = async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send("Unknown ID : " + id);
  }
  try {
    await PostModel.findByIdAndUpdate(
      id,
      {
        $pull: { likers: req.body.id },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    await UserModel.findByIdAndUpdate(
      req.body.id,
      {
        $pull: { likes: id },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json("Post unliked");
  } catch (err) {
    console.log("Error unliking Post : ", err);
    res.status(500).json(err);
  }
};

// -----------------------
// Comment a post
// -----------------------
export const postComment = async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send("Unknown ID : " + id);
  }

  try {
    const comment = await PostModel.findByIdAndUpdate(
      id,
      {
        $push: {
          comments: {
            commenterId: req.body.commenterId,
            commenterPseudo: req.body.commenterPseudo,
            text: req.body.text,
            timestamp: new Date().getTime(),
          },
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(200).json(comment);
  } catch (err) {
    console.log("Error commenting Post : ", err);
    res.status(500).json(err);
  }
};

// --------------------------
// Edit a comment on a post
// --------------------------
export const editPostComment = async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send("Unknown ID : " + id);
  }

  try {
    const post = await PostModel.findById(id).exec();
    const theComment = post.comments.find(
      (comment) => comment._id == req.body.commentId
    );
    if (!theComment) return res.status(404).send("Comment not found");
    theComment.text = req.body.text;
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    console.log("Error editing Post comment : ", err);
    res.status(500).json(err);
  }
};
// ----------------------------
// delete a comment on a post
// ----------------------------
export const deletePostComment = async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send("Unknown ID : " + id);
  }

  try {
    const comment = await PostModel.findByIdAndUpdate(
      id,
      {
        $pull: {
          comments: { _id: req.body.commentId },
        },
      },
      { new: true }
    );
    if (!comment) {
      return res.status(404).send("Post not found");
    }
    res.status(200).json(comment);
  } catch (err) {
    console.log("Error deleting Post comment : ", err);
    res.status(500).json(err);
  }
};
