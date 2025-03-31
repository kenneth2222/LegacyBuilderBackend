const mongoose = require("mongoose");

<<<<<<< HEAD
const userSChema = new mongoose.Schema({

    fullName: {
        type: String,
        require: true
    },

    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },
=======
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

>>>>>>> 32eb3dcb36906562f2803f0370898fe2e718ca1e
    username: {
      type: String,
      require: true,
      unique: true,
<<<<<<< HEAD
      minlength: 3, 
      maxlength: 30
  },
    isVerified: {
        type: Boolean,
        default: false
=======
      minlength: 3,
      maxlength: 30,
    },

    isVerified: {
      type: Boolean,
      default: false,
>>>>>>> 32eb3dcb36906562f2803f0370898fe2e718ca1e
    },

    roles: {
      type: String,
      enum: ["admin", "user"],
<<<<<<< HEAD
      default: 'user'
    },
    isLoggedIn:{
        type: Boolean,
        default: false

    }

}, { timestamps: true })

const userModel = mongoose.model("Users", userSChema);

module.exports = userModel
=======
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
>>>>>>> 32eb3dcb36906562f2803f0370898fe2e718ca1e
