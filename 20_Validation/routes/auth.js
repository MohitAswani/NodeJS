const express = require('express');
const { body } = require('express-validator');   // we use a sub package which will be used for validation.

// Also we just need the check function of the following object and hence we only extract that.

const router = express.Router();

const authController = require('../controllers/auth');
const User = require('../models/user');

router.get('/login', authController.getLogin);

router.post('/login',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email')
            .normalizeEmail(),   // used to normalize email so lowercase not starting with an uppercase character, no excess whitespace
        body('password','Please enter a password with min 6 alphanumeric characters.')
            .isLength({min:6})
            .isAlphanumeric()
            .trim()   // used to trim the data
    ],
    authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

// The body function will return a middleware which can be used to look for fields in body.

// In this function  we add field names or array of field names which we want to check.

// This tells express that we are interested in validating in email.

// This will validate the email and store the result in the validation result object.

// We extract those errors in the controller.

// We can add the withMessage() to print a custom message on a validation error and it will always refer to the validation login right before it. We also add isAlphanumber to check that it always contains numbers and characters.

// We can also write our own custom validators using .custom function.

// The custom function takes in value of the paramater and some other field and returns an error based on the logic.

// We use the isLength and set the min length to make sure that the length of the password is atleast 6 characters.

// And we put all our validators in a array to group them together.

// To add a default error message for our validators we can just add it as another field in body function.

// Also we can validate whether a user exists in database here itself and throw an error if it does.

// Instead of adding a catch block inside the custom validator which checks whether the user exists , we return User.findOne.

// So now the express validator will check for a custom validator to return true or false, to return a thrown error or to return a promise.

// If its a promise as it is the case below (since every then implicitly returns a new promise) then express validator will wait for this promise to be fulfilled and if it fulfills with nothing then its a success.

// And if it fulfils with rejection then exp-validator with detect this rejection and will store this as a error.

// This is how we add our own async validation.

router.post('/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email')
            .custom((value, { req }) => {
                // if (value === 'test@test.com') {
                //     throw new Error('This email address is forbidden.')
                // }   //error is we fail

                return User.findOne({ email: value })
                    .then(user => {
                        if (user) {

                            // Inside of the if block in the then statement we will return a new promise reject call.

                            // A promise is a built in js object and with reject we basically throw an error inside of the promise and we reject with the below error message.

                            return Promise.reject('Email already exists');
                        }
                    });

                return true;       // for success.
            })
            .normalizeEmail(),
        body('password', 'Please enter a password with min 6 alphanumeric characters.')
            .isLength({ min: 6 })
            .isAlphanumeric()
            .trim(),
        body('confirm_password')
            .trim()
            .custom((value, { req }) => {

                // This is the reason for which we need access to some paramaters like request.

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