module.exports=(req,res,next)=>{
    if(!req.session.isAuth){

        // we do make the status code 401 but it will be overriten by the redirect code.

        return res.status(401).redirect('/login');
    }
    next();
}