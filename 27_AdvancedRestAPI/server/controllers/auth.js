const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        error.data = errors.array()
        throw error;  // will leave this function and refer to the next error handing part.
    }

    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;

    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                name: name
            });

            return user.save();
        })
        .then(result => {
            res.status(201)  // resource created.
                .json({ message: 'User created!', userid: result._id });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }

            next(err);
        });
}

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    let loadedUser;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                const error = new Error('No such user exist');
                error.statusCode = 401;  // Not authenticated
                throw error;
            }

            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Wrong password');
                error.statusCode = 401;  // Not authenticated
                throw error;
            }

            // The sign method creates a new signature and packs that into a new JSON WEB TOKEN.

            // We can add any data we want into the token.

            // The second argument in the sign method is the private key that is used for signing the token.(which will only be known to the server) 

            // The third argument is the options field where we can for example set how the long before the token expires.

            // Also we set the expiresIn to 1hr due to security becuase the token is stored on the browser and some person might steel it use it for himself so adding expiresIn will limit the amount of time other person can use his account.

            const token = jwt.sign({
                email: loadedUser.email,
                userId: loadedUser._id
            },
                process.env.JWT_SECRET_KEY, {
                expiresIn: '1h'
            });

            res.status(200).json({ token: token, userId: loadedUser._id.toString() });

        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }

            next(err);
        });
}