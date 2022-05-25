const path = require('path');

const express = require('express');
const { body } = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/add-product', isAuth, adminController.getAddProduct);

router.get('/products', adminController.getProducts);

router.post('/add-product',
    [
        body('title')
            .isString()
            .isLength({ min: 3 })
            .trim(),
        body('price')
            .isFloat(),
        body('description')
            .isLength({ min: 5, max: 400 })
            .trim(),
    ],
    isAuth,
    adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product',
    [
        body('title')
            .isAlphanumeric()
            .isLength({ min: 3 })
            .trim(),
        body('price')
            .isFloat(),
        body('description')
            .trim()
            .isLength({ min: 5}),
    ], 
    isAuth, 
    adminController.postEditProduct);

// router.post('/delete-product', isAuth, adminController.postDeleteProduct);

// Till now we only made use of get and post coz natively browser only supports those.

// But when we send request through JS we have access to other HTTP requests too.

// Now we use a delete HTTP verb which makes a lot of sense for deleting.

// It is only a semantic thing and we can use any HTTP request to anything coz we define that using our server side logic.

router.delete('/product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;