
exports.get404 = (req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page Not found', path: {} });
};

exports.get500 = (req, res, next) => {
    res.status(500).render('500', { 
        pageTitle: 'Server errror', 
        path: '/500',
        isAuth:req.session.isAuth
    });
};

