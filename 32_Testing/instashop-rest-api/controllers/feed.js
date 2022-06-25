const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');

const Post = require('../models/post');
const User = require('../models/user');

exports.getPosts = async (req, res, next) => {
    try {
        const currentPage = req.query.page || 1;  // checks whether its undefined
        const perPage = 2;

        const totalItems = await Post.find()
            .countDocuments();

        const posts = await Post.find()
            .populate('creator')
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        res.status(200).json({
            message: 'Fetched posts successfully.',
            posts: posts,
            totalItems: totalItems
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    };
};

exports.postPost = async (req, res, next) => {
    try {
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
        const post = new Post({
            title: title,
            content: content,
            imageUrl: imageUrl,
            creator: req.userId
        });

        await post.save();

        const user = await User.findById(req.userId);
        creator = user;
        user.posts.push(post);

        await user.save();

        res.status(201).json({
            message: 'Post created successfully!',
            post: post,
            creator: {
                _id: user._id,
                name: user.name
            }
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);   // will reach the next error handling middleware.
    }


};

exports.getPost = async (req, res, next) => {
    try {
        const postId = req.params.postId;

        const post = await Post.findById(postId);

        if (!post) {
            const error = new Error('Could not find post');
            error.statusCode = 404;
            throw error;   // if we throw an error it will we caught by the catch block.
        }

        res.status(200).json({
            message: 'Post fetched.',
            post: post
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.updatePost = async (req, res, next) => {
    try {
        const postId = req.params.postId;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const error = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            throw error;
        }

        const { title, content } = req.body;
        let imageUrl = req.body.image;
        if (req.file) {
            imageUrl = req.file.path;
        }

        if (!imageUrl) {
            const error = new Error('No file picked');
            error.statusCode = 422;
            throw error;
        }

        const post = await Post.findById(postId);

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

        const result = await post.save();

        res.status(200).json({ message: 'Post updated!', post: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.deletePost = async (req, res, next) => {
    try {
        const postId = req.params.postId;

        const post = await Post.findById(postId);

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

        await Post.findByIdAndRemove(postId);

        const user = await User.findById(req.userId);

        user.posts.pull(postId);

        await user.save();

        res.status(200).json({ message: 'Deleted post' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getStatus = async (req, res, next) => {

    try {
        const user = await User.findById(req.userId);

        if (!user) {
            const error = new Error('No user found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ status: user.status });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }

        next(err);
    };
}

exports.updateStatus = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const error = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            throw error;
        }

        const status = req.body.status;

        const user = await User.findById(req.userId);

        if (!user) {
            const error = new Error('No user found');
            error.statusCode = 404;
            throw error;
        }

        user.status = status;
        await user.save();
        res.status(200).json({ message: 'Status updated' });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }

        next(err);
    };
}


const clearImage = (filepath) => {
    filepath = path.join(__dirname, '..', filepath);
    fs.unlink(filepath, err => {
        console.log(err);
    });
};