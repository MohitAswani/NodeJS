const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const feedController = require('../controllers/feed');

const isAuth = require('../middleware/is-auth');


// GET /feed/posts
router.get('/posts', isAuth, feedController.getPosts);

// POST /feed/post
router.post('/post',
    isAuth,
    [
        body('title')
            .trim()
            .isLength({ min: 5 }),
        body('content')
            .trim()
            .isLength({ min: 7 })
    ],
    feedController.postPost);

router.get('/post/:postId', feedController.getPost);

router.put('/post/:postId',
    isAuth,
    [
        body('title')
            .trim()
            .isLength({ min: 5 }),
        body('content')
            .trim()
            .isLength({ min: 5 })
    ],
    feedController.updatePost);

router.delete('/post/:postId', isAuth, feedController.deletePost);

router.get('/status', feedController.getStatus);

router.put('/update-status', isAuth,
    [
        body('status')
            .trim()
            .not()
            .isEmpty()
    ], feedController.updateStatus);

module.exports = router;