const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

const products = [];

router.get('/add-product', (req, res, next) => {
    res.render('add-product',{pageTitle:'Add Product'});
});

router.post('/product', (req, res, next) => {
    products.push({ title: req.body.title,
                    price: req.body.price,
                    description: req.body.description,
                    image: req.body.image });
    console.log(req.body);
    res.redirect('/');
});

module.exports = {
    router: router,
    products: products
};