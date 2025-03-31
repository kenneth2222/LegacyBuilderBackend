const mongoose = require("mongoose");

const userSChema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      require: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      require: true,
      unique: true,
      minlength: 3,
      maxlength: 30,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    roles: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    isLoggedIn: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("Users", userSChema);

module.exports = userModel;
