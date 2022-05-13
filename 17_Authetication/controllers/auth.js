const User = require('../models/user');

exports.getLogin = (req, res, next) => {

    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuth: req.session.isAuth
    });
}

exports.postLogin = (req, res, next) => {

    User.findById('627b5ae2498197c6cdd07cad')
        .then(user => {
            req.session.isAuth = true;
            req.session.user = user;   
            req.session.save();
        })
        .then(result=>{
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        });
}

exports.postLogout = (req, res, next) => {

    req.session.destroy((err)=>{
        if(err){
            console.log(err);
        }
        res.redirect('/');
    });
}