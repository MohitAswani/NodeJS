const {validationResult} =require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.signup=(req,res,next)=>{
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        error.data=errors.array()
        throw error;  // will leave this function and refer to the next error handing part.
    }

    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;

    bcrypt.hash(password,12)
        .then(hashedPassword=>{
            const user=new User({
                email:email,
                password:hashedPassword,
                name:name
            });

            return user.save();
        })
        .then(result=>{
            res.status(201)  // resource created.
               .json({message:'User created!',userid:result._id});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }

            next(err);
        });
}

exports.login = (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;

    let loadedUser;

    User.findOne({email:email})
        .then(user=>{
            if(!user){
                const error=new Error('No such user exist');
                error.statusCode=401;  // Not authenticated
                throw error;
            }

            loadedUser=user;
            return bcrypt.compare(password,user.password);
        })
        .then(isEqual=>{
            if(!isEqual){
                const error=new Error('Wrong password');
                error.statusCode=401;  // Not authenticated
                throw error;
            }
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }

            next(err);
        });
}