import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/AuthController.js"; // ROUTES --> CONTROLLERS
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  follow,
  unfollow,
} from "../controllers/UserController.js"; // ROUTES --> CONTROLLERS
import { uploadProfile } from "../controllers/UploadController.js"; // ROUTES --> CONTROLLERS
import { upload } from "../middleware/UploadMiddleware.js";
import multer from "multer";
const upload = multer({ storage: storage });

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, "public/images");
//     },
//     filename: (req, file, cb) => {
//       cb(null, req.body.name);
//     },
//   });
// router.post("/", upload.single("file"), (req, res) => {
//   try {
//     return res.status(200).json("File uploded successfully");
//   } catch (error) {
//     console.error(error);
//   }
// });

const router = express.Router();

// auth
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

// user db
router.get("/", getAllUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.patch("/follow/:id", follow);
router.patch("/unfollow/:id", unfollow);

// upload
router.post("/upload", upload.single("file"), uploadProfile);

export default router;
