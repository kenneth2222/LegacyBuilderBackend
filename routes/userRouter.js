<<<<<<< HEAD
const express = require('express')
=======
// const express = require('express')
>>>>>>> 32eb3dcb36906562f2803f0370898fe2e718ca1e

const {registerAdmin, registerUser, verifyUser, loginUser, forgotUserPassword,
   resetUserPassword, changeUserPassword,logoutUser } = require('../controller/userController');

const { authenticate, adminAuth} = require('../middleware/authentication');
<<<<<<< HEAD
const router = require('express').Router();

router.post('/user', registerUser);
router.post('/user/login/', loginUser);
router.post('/forgot=password/user', forgotUserPassword);
router.post('/reset=password/user/:token', resetUserPassword);
router.get('/verify/user/:token', verifyUser);
router.post('/change/password/user/:id',  changeUserPassword);
router.post('/logout',authenticate,  logoutUser);


module.exports = router
=======
const userRouter = require('express').Router();

userRouter.post('/user', registerUser);
userRouter.post('/user/login/', loginUser);
userRouter.post('/forgot_password/user', forgotUserPassword);
userRouter.post('/reset_password/user/:token', resetUserPassword);
userRouter.get('/verify/user/:token', verifyUser);
userRouter.post('/change/password/user/:id', changeUserPassword);
userRouter.post('/logout', authenticate,  logoutUser);


module.exports = userRouter;
>>>>>>> 32eb3dcb36906562f2803f0370898fe2e718ca1e
