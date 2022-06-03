const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');

const Post = require('../models/post');
const User = require('../models/user');

exports.getPosts = (req, res, next) => {
    const currentPage = req.query.page || 1;  // checks whether its undefined
    const perPage = 2;

    let totalItems;
    Post.find()
        .countDocuments()
        .then(count => {
            totalItems = count;
            return Post.find()
                .skip((currentPage - 1) * perPage)
                .limit(perPage);
        })
        .then(posts => {
            res.status(200).json({
                message: 'Fetched posts successfully.',
                posts: posts,
                totalItems: totalItems
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }

            next(err);
        });
};

exports.postPost = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;  // will leave this function and refer to the next error handing part.
    }

    if (!req.file) {
        const error = new Error('No images provided');
        error.statusCode = 422;
        throw error;
    }

    const imageUrl = req.file.path;
    const title = req.body.title;
    const content = req.body.content;
    let creator;
    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: req.userId // we set this up in is-auth
    });                // In this we don't need to setup createAt since we added timestamps in the options.

    post.save()
        .then(result => {
            return User.findById(req.userId);
        })
        .then(user => {
            creator = user;
            user.posts.push(post);
            return user.save();
        })
        .then(result => {
            res.status(201).json({
                message: 'Post created successfully!',
                post: post,
                creator: {
                    _id: creator._id,
                    name: creator.name
                }
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }

            next(err);   // will reach the next error handling middleware.
        })


};

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;

    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Could not find post');
                error.statusCode = 404;
                throw error;   // if we throw an error it will we caught by the catch block.
            }
            return res.status(200).json({
                message: 'Post fetched.',
                post: post
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }

            next(err);
        })
}

exports.updatePost = (req, res, next) => {
    const postId = req.params.postId;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }

    const { title, content } = req.body;
    let imageUrl = req.body.image;  // when no new file is picked and our frontend code returns the previously added files link.
    if (req.file) {
        imageUrl = req.file.path; // if new file is added.
    }

    if (!imageUrl) {
        const error = new Error('No file picked');
        error.statusCode = 422;
        throw error;
    }

    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Could not find post');
                error.statusCode = 404;
                throw error;
            }

            if (post.creator.toString() !== req.userId.toString()) {
                const error = new Error('Not authorized');
                error.statusCode = 403;
                throw error;
            }

            if (imageUrl !== post.imageUrl) {
                clearImage(post.imageUrl);
            }

            post.title = title;
            post.imageUrl = imageUrl;
            post.content = content;

            return post.save();
        })
        .then(result => {
            res.status(200).json({ message: 'Post updated!', post: result });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }

            next(err);
        })
};

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;

    Post.findById(postId)
        .then(post => {

            if (!post) {
                const error = new Error('Could not find post');
                error.statusCode = 404;
                throw error;
            }

            // Check logged in user.
            if (post.creator.toString() !== req.userId.toString()) {
                const error = new Error('Not authorized');
                error.statusCode = 403;
                throw error;
            }

            clearImage(post.imageUrl);
            return Post.findByIdAndRemove(postId);
        })
        .then(result => {
            return User.findById(req.userId);
        })
        .then(user => {
            // Moongoose provides a pull method to remove an object from an array.            

            user.posts.pull(postId);
            return user.save();
        })
        .then(result => {
            res.status(200).json({ message: 'Deleted post' });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }

            next(err);
        })
}

exports.getStatus = (req, res, next) => {

    User.findById(req.userId)
        .then(user => {
            if(!user)
            {
                const error=new Error('No user found');
                error.statusCode=404;
                throw error;
            }

            res.status(200).json({ status: user.status });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }

            next(err);
        });
}

exports.updateStatus = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;  // will leave this function and refer to the next error handing part.
    }
    
    const status = req.body.status;

    User.findById(req.userId)
        .then(user=>{
            if(!user)
            {
                const error=new Error('No user found');
                error.statusCode=404;
                throw error;
            }

            user.status=status;
            return user.save();
        })
        .then(user => {
            res.status(200).json({ message:'Status updated' });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }

            next(err);
        });
}


const clearImage = (filepath) => {
    filepath = path.join(__dirname, '..', filepath);
    fs.unlink(filepath, err => {
        console.log(err);
    });  // Using the unlink function to delete file.
};