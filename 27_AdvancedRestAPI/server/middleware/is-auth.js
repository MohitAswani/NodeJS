const jwt = require('jsonwebtoken');

module.exports=(req,res,next)=>{
    const authHeader = req.get('Authorization');

    if(!authHeader)
    {
        const error=new Error('Not authenticated');
        error.statusCode=401;
        throw error;
    }

    const token=authHeader.split(' ')[1];  // to get the header

    let decodedToken;

    try{

        // We can either use one of the two methods here :

        // decode : only decodes this token.

        // verify : validates as well as decodes the token.

        decodedToken=jwt.verify(token,process.env.JWT_SECRET_KEY)
    }
    catch(err){
        err.statusCode=500;
        throw err;
    }

    if(!decodedToken)  // when the token is not verified
    {
        const error=new Error('Not authenticated');
        error.statusCode=401;
        throw error;
    }

    req.userId=decodedToken.userId;  // will be used later to perform different actions.
    next();
};