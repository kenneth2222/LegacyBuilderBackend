const express = require('express')

const {registerAdmin, registerUser, verifyUser, loginUser, forgotUserPassword,
   resetUserPassword, changeUserPassword,logoutUser } = require('../controller/userController');

const { authenticate, adminAuth} = require('../middleware/authentication');
const router = require('express').Router();

router.post('/user', registerUser);
router.post('/user/login/', loginUser);
router.post('/forgot=password/user', forgotUserPassword);
router.post('/reset=password/user/:token', resetUserPassword);
router.get('/verify/user/:token', verifyUser);
router.post('/change/password/user/:id',  changeUserPassword);
router.post('/logout',authenticate,  logoutUser);


module.exports = router