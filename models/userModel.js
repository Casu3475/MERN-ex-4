import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail.js";
import bcrypt from "bcrypt";

// mongoose.Schema + mongoose.model
const UserSchema = mongoose.Schema(
  {
    pseudo: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [isEmail],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      minLength: 6,
    },
    profilePicture: {
      type: String,
      default: "./uploads/default/defaultProfilePicture.png",
    },

    bio: {
      type: String,
      max: 1024,
    },
    followers: {
      type: [String],
    },
    following: {
      type: [String],
    },
    likes: {
      type: [String],
    },
    // coverPicture: String,
    // about: String,
    // livesIn: String,
    // worksAt: String,
    // country: String,
  },
  { timestamps: true }
);

// play function before saving into DB
UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// when logout, remove the salt
UserSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email }); // find email...
  if (user) {
    //... and search the user
    const auth = await bcrypt.compare(password, user.password); // compare password and user.password
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);
// const UserModel = mongoose.model("User", UserSchema);
export default UserModel;
