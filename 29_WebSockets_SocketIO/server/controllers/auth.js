const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = async (req, res, next) => {
    
    try {
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            error.data = errors.array()
            throw error;
        }
    
        const email = req.body.email;
        const name = req.body.name;
        const password = req.body.password;
        
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            email: email,
            password: hashedPassword,
            name: name
        });

        const result = await user.save();

        res.status(201)  // resource created.
            .json({ message: 'User created!', userid: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const loadedUser = await User.findOne({ email: email });

        if (!loadedUser) {
            const error = new Error('No such user exist');
            error.statusCode = 401;  // Not authenticated
            throw error;
        }

        const isEqual = await bcrypt.compare(password, loadedUser.password);

        if (!isEqual) {
            const error = new Error('Wrong password');
            error.statusCode = 401;  // Not authenticated
            throw error;
        }

        const token = jwt.sign({
            email: loadedUser.email,
            userId: loadedUser._id
        },
            process.env.JWT_SECRET_KEY, {
            expiresIn: '1h'
        });

        res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    } catch (err) {

        if (!err.statusCode) {
            err.statusCode = 500;
        }

        next(err);
    }
}