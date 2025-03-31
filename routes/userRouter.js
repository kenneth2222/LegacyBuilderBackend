// const express = require('express')

const {registerAdmin, registerUser, verifyUser, loginUser, forgotUserPassword,
   resetUserPassword, changeUserPassword,logoutUser } = require('../controller/userController');

const { authenticate, adminAuth} = require('../middleware/authentication');
const userRouter = require('express').Router();

userRouter.post('/user', registerUser);
userRouter.post('/user/login/', loginUser);
userRouter.post('/forgot_password/user', forgotUserPassword);
userRouter.post('/reset_password/user/:token', resetUserPassword);
userRouter.get('/verify/user/:token', verifyUser);
userRouter.post('/change/password/user/:id', changeUserPassword);
userRouter.post('/logout', authenticate,  logoutUser);


module.exports = userRouter;