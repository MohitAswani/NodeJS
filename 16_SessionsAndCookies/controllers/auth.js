exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuth:req.isLoggedIn
    });
}


exports.postLogin = (req,res,next) =>{

    // This will not work since once we send the response the req is finished and won't affect the futures requests.

    // This data is lost after the response.

    // So request do not store state information and every request even from the same user is to be treated differently.

    // Also we are affecting this after every route and not before every route is handled hence it won't work.

    req.isLoggedIn=true;
    res.redirect('/');
}