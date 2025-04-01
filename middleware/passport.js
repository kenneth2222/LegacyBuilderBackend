const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require('passport');
const userModel = require('../model/userModel');
const bcrypt = require("bcrypt");



passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // callbackURL: "http://localhost:2025/auth/google/login"//This is where the user will be redirected after successful login
    callbackURL: "http://localhost:2025/auth/google/login"//This is where the user will be redirected after successful login
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
      let user = await userModel.findOne({email: profile.emails[0].value});
      if(!user){
        const randomPassword = await bcrypt.hash(profile.id, 10);

        user = new userModel({
            fullName: profile.displayName,
            email: profile.emails[0].value,
            isVerified: true,  // Set to true since Google verifies emails
            username: profile.displayName.replace(/\s+/g, '').toLowerCase(), // Auto-generate username
            roles: "user", 
            isLoggedIn: true, 
            password: randomPassword,
        });
        await user.save();
      }
      return cb(null, user);
  }catch (error) {
      console.log(error.message);
      return cb(error, null);
  }
  }
));


//Passport Facebook Strategy  
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "http://localhost:2025/auth/facebook/callback",
      profileFields: ["id", "displayName", "emails"],
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        let user = await userModel.findOne({ email: profile.emails[0].value });

        const randomPassword = await bcrypt.hash(profile.id, 10);
        if (!user) {
          user = new userModel({
            fullName: profile.displayName,
            email: profile.emails[0].value,
            username: profile.displayName.replace(/\s+/g, "").toLowerCase(),
            isVerified: true,
            roles: "user", 
            isLoggedIn: true, 
            password: randomPassword,
          });
          await user.save();
        }
        return cb(null, user);
      } catch (error) {
        console.log(error.message);
        return cb(error, null);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
    // console.log('User Serialised:', user);
    cb(null, user._id);
});
  
  passport.deserializeUser(async (id, cb) => {
    try{
        const user = await userModel.findById(id);
        if(!user){
            return cb(new Error('User not found'), null);
        }
        cb(null, user);
    }catch (error) {
        console.log(error.message);
        return cb(error, null);
    }
  });

  module.exports = passport;