const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth');

router.get('/login',authController.getLogin);

router.post('/login',authController.postLogin);

router.post('/logout',authController.postLogout);

router.get('/signup',authController.getSignup);

router.post('/signup',authController.postSignup);

router.get('/resetPassword',authController.getReset);

router.post('/resetPassword',authController.postReset);

router.get('/resetPassword/:token',authController.getNewPassword);

router.post('/newPassword',authController.postNewPassword);

module.exports=router;