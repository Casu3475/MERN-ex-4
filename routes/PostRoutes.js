import express from "express";
import {
  createPost,
  readPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
} from "../controllers/PostController.js"; // ROUTES --> CONTROLLERS
import {
  postComment,
  editPostComment,
  deletePostComment,
} from "../controllers/PostController.js"; // ROUTES --> CONTROLLERS

const router = express.Router();

// posts
router.get("/", readPost);
router.post("/", createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.patch("/like-post/:id", likePost);
router.patch("/unlike-post/:id", unlikePost);

// comments
router.patch("/comment-post/:id", postComment);
router.patch("/edit-comment-post/:id", editPostComment);
router.delete("/delete-comment-post/:id", deletePostComment);

export default router;
