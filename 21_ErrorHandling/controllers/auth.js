const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');

const crypto = require('crypto');

const User = require('../models/user');

const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
        ciphers: 'SSLv3'
    },
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: req.flash('error'),
        oldInput: { email: '', password: '' },
        validationErrors: []
    });
}

exports.postLogin = (req, res, next) => {

    const { email, password } = req.body;
    const errors = validationResult(req);


    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: errors.array()[0].msg,
            oldInput: { email: email, password: password },
            validationErrors: errors.array()
        });
    }

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(422).render('auth/login', {
                    path: '/login',
                    pageTitle: 'Login',
                    errorMessage: 'Invalid email or password.',
                    oldInput: { email: email, password: password },
                    validationErrors: []
                });
            }

            bcrypt
                .compare(password, user.password)
                .then(result => {
                    if (result) {
                        req.session.isAuth = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            if (err) {
                                const error = new Error(err);
                                error.httpStatusCode = 500;
                                return next(error);
                            }
                            return res.redirect('/');
                        })
                    }

                    return res.status(422).render('auth/login', {
                        path: '/login',
                        pageTitle: 'Login',
                        errorMessage: 'Invalid email or password.',
                        oldInput: { email: email, password: password },
                        validationErrors: []
                    });
                })
                .catch(err => {
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                    return next(error);
                })

        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.postLogout = (req, res, next) => {

    req.session.destroy((err) => {
        if (err) {
            const error=new Error(err);
            error.httpStatusCode= 500;
            return next(error);
        }
        res.redirect('/');
    });
}

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Sign up',
        errorMessage: req.flash('error'),
        oldInput: { email: '', password: '', confirmPassword: '' },
        validationErrors: []
    });
}

exports.postSignup = (req, res, next) => {

    const { email, password, confirmPassword } = req.body;
    const errors = validationResult(req);   // this will extract the validation errors from the request and store them in this constant.

    if (!errors.isEmpty()) {

        // 422 is the status code for validation errors.

        // console.log(errors.array());

        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Sign up',
            errorMessage: errors.array()[0].msg,   // only printing the error message.
            oldInput: { email: email, password: password, confirmPassword: confirmPassword },
            validationErrors: errors.array()
        });
    }

    bcrypt
        .hash(password, 12)
        .then(hashedpassword => {
            const newuser = new User({
                email: email,
                password: hashedpassword,
                cart: { items: [] }
            })
            return newuser.save();
        })
        .then(result => {
            res.redirect('/login');
            return transporter.sendMail({
                to: email,
                from: 'test69420@outlook.in',
                subject: 'Sign up successful',
                html: '<h1>You signed up successfully</h1>'
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })

}

exports.getReset = (req, res, next) => {
    res.render('auth/reset_password', {
        path: '/resetPassword',
        pageTitle: 'Reset password',
        errorMessage: req.flash('error')
    });
}

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buff) => {
        if (err) {
            console.log(err);
            return res.redirect('/resetPassword');
        }

        const token = buff.toString('hex');
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'No user with that email found');
                    return res.redirect('/resetPassword');
                }

                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                res.redirect('/');
                return transporter.sendMail({
                    to: req.body.email,
                    from: 'test69420@outlook.in',
                    subject: 'Password reset',
                    html: `
                        <p>You requested a password request</p>
                        <p>Click this <a href='http://localhost:3000/resetPassword/${token}'>link</a> to set a new password.</p>
                    `
                });
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            })
    })
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;

    User.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() }
    })
        .then(user => {
            if (!user) {
                req.flash('error', 'Something went wrong!')
                return res.redirect('/login');
            }
            res.render('auth/new_password', {
                path: '/newPassword',
                pageTitle: 'New password',
                errorMessage: req.flash('error'),
                userId: user._id.toString(),
                resetToken: token
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })

}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const resetToken = req.body.resetToken;
    let resetUser;

    User.findOne({
        resetToken: resetToken,
        resetTokenExpiration: { $gt: Date.now() },
        _id: userId
    })
        .then(user => {
            if (!user) {
                req.flash('error', 'Something went wrong!')
                return res.redirect('/login');
            }
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then(hashedpassword => {
            resetUser.password = hashedpassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        })
        .then(result => {
            res.redirect('/login');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}