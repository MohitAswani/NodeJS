const express = require('express');
const { body } = require('express-validator');   

const router = express.Router();

const authController = require('../controllers/auth');
const User = require('../models/user');

router.get('/login', authController.getLogin);

router.post('/login',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email')
            .normalizeEmail(),  
        body('password','Please enter a password with min 6 alphanumeric characters.')
            .isLength({min:6})
            .isAlphanumeric()
            .trim() 
    ],
    authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post('/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email')
            .custom((value, { req }) => {

                return User.findOne({ email: value })
                    .then(user => {
                        if (user) {
                            return Promise.reject('Email already exists');
                        }
                    });

                return true;     
            })
            .normalizeEmail(),
        body('password', 'Please enter a password with min 6 alphanumeric characters.')
            .isLength({ min: 6 })
            .isAlphanumeric()
            .trim(),
        body('confirm_password')
            .trim()
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords have to match');
                }

                return true;
            })
    ],
    authController.postSignup);

router.get('/resetPassword', authController.getReset);

router.post('/resetPassword', authController.postReset);

router.get('/resetPassword/:token', authController.getNewPassword);

router.post('/newPassword', authController.postNewPassword);

module.exports = router;