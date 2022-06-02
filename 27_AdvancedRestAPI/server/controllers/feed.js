const { validationResult } = require('express-validator');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
    Post.find()
        .then(posts=>{
            res.status(200).json({
                message:'Fetched posts successfully.',
                posts:posts
            });
        })
        .catch(err=>{
            if(!err.statusCode){
                err.statusCode=500;
            }

            next(err);
        });
};

exports.postPost = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error=new Error('Validation failed, entered data is incorrect.');
        error.statusCode=422;
        throw error;  // will leave this function and refer to the next error handing part.
    }
    
    if(!req.file){
        const error =new Error('No images provided');
        error.statusCode=422;
        throw error;
    }

    const imageUrl = req.file.path;
    const title = req.body.title;
    const content = req.body.content;
    const post = new Post({
        title: title,
        content: content,
        imageUrl:imageUrl,
        creator: 'Mohit'
    });                // In this we don't need to setup createAt since we added timestamps in the options.

    post.save()
        .then(result=>{
            console.log(result);
            res.status(201).json({
                message: 'Post created successfully!',
                post: result
            });
        })
        .catch(err=>{
            if(!err.statusCode){
                err.statusCode=500;
            }

            next(err);   // will reach the next error handling middleware.
        })

    
};

exports.getPost=(req,res,next)=>{
    const postId=req.params.postId;

    Post.findById(postId)
        .then(post=>{
            if(!post){
                const error=new Error('Could not find post');
                error.statusCode(404);
                throw error;   // if we throw an error it will we caught by the catch block.
            }
            return res.status(200).json({
                message:'Post fetched.',
                post:post
            });
        })
        .catch(err=>{
            if(!err.statusCode){
                err.statusCode=500;
            }

            next(err);
        })
}