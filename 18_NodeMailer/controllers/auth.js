const bcrypt = require('bcrypt');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: req.flash('error') 
    });
}

exports.postLogin = (req, res, next) => {

    const { email, password } = req.body;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error','Invalid email or password.');
                return res.redirect('/login');
            }

            bcrypt
                .compare(password, user.password)   
                .then(result => {
                    if (result) {
                        req.session.isAuth = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            if (err) {
                                console.log(err);
                            }
                            return res.redirect('/');
                        })
                    }

                    req.flash('error','Invalid email or password.');
                    return res.redirect('/login');
                })
                .catch(err => {
                    console.log(err);
                })

        })
        .catch(err => {
            console.log(err);
        });
}

exports.postLogout = (req, res, next) => {

    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    });
}

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Sign up',
        errorMessage:req.flash('error')
    });
}

exports.postSignup = (req, res, next) => {

    const { email, password, confirm_password } = req.body;

    User.findOne({ email: email })
        .then(user => {
            if (user) {
                req.flash('error','Email already exists');
                return res.redirect('/signup');    
            }
            return bcrypt
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
                })
        })
        .catch(err => {
            console.log(err);
        })
}

