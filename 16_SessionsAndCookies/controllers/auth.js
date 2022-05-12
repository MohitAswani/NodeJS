const User = require('../models/user');

exports.getLogin = (req, res, next) => {

    // Here we are using cookie-parser to parse and access the cookies.

    // const isAuth=req.cookies.isAuth=='true';

    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuth: req.session.isAuth
    });
}


exports.postLogin = (req, res, next) => {

    // This will not work since once we send the response the req is finished and won't affect the futures requests.

    // This data is lost after the response.

    // So request do not store state information and every request even from the same user is to be treated differently.

    // Also we are affecting this after every route and not before every route is handled hence it won't work.

    // req.isLoggedIn=true;

    // In the below line we set a cookie by simply setting a header on our response. The header we set 'Set-Cookie' is a reserved name which sets the cookie.

    // Value for Set-Cookie is a key value pair where we define any name we want and any value we want.

    // We can see our cookies by going to application tab in developer tools and then checking cookies.

    // Also our cookie right now is a session cookie so it will expire once we close the browser.

    // Now every request will have this cookie attached with itself and will be sent to the server.

    // Hence a cookie is a cross request data.

    // But the issue with using cookie for auth is that a user can edit cookies and use them for malicous purposes.

    // res.setHeader('Set-Cookie','loggedIn=true');

    // Following is better way of setting cookies with much more options.

    // res.cookie("isAuth", true, {
    //     expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    //     httponly: true
    // });

    // This session will be stored in memory (at server side) by default and will use the session id cookie to identify the user.

    // This session will be different for different users. And it needs the session id to identify the user but the sensitive info is stored on the server and not the frontside.

    // This session is stored on memory and for production not the best option so we will use mongo to store sessions.

    User.findById('627b5ae2498197c6cdd07cad')
        .then(user => {
            req.session.isAuth = true;
            req.session.user = user;   // This is not a mongoose object so we can't call methods on it.
            // res.redirect('/');  // sometimes redirect can be faster than the session is saved so we use req.session.save to ensure that the session is saved before redirecting.
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

    // Following is an inbuilt method provided by session to destroy a session in the database.

    // It can also take a function which will be called once the session is destroy.

    req.session.destroy((err)=>{
        if(err){
            console.log(err);
        }
        res.redirect('/');
    });
}