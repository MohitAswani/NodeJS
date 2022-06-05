const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');

const authController = require('../controllers/auth');

const router = express.Router();

router.put('/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email')
            .custom(async (value, { req }) => {
                try{
                    const user = await User.findOne({ email: value });
    
                    if (user) {
                        return Promise.reject('Email already exists');
                    }

                    return Promise.resolve();
                }
                catch(err){
                    if (!err.statusCode) {
                        err.statusCode = 500;
                    }
                    next(err);
                }
            })
            .normalizeEmail(),
        body('password')
            .trim()
            .isLength({ min: 5 }),
        body('name')
            .trim()
            .not()
            .isEmpty()
    ],
    authController.signup);

router.post('/login', authController.login);

module.exports = router;