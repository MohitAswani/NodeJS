const path=require('path');

const express = require('express');

const rootDir=require('../util/path');

const router = express.Router();

// if we use a local variable to store the data , the data will be inherent to the node app rather than to a particular user. And usually we dont want that.

// we want every user to have his own data which is different from others.

const products=[];

router.get('/add-product', (req, res, next) => {
    res.sendFile(path.join(rootDir,'views','add-product.html'));
});
router.post('/product', (req, res, next) => {
    console.log(req.body);
    products.push({title: req.body.title});
    res.redirect('/');
});


module.exports ={
    'router': router,
    'products': products
};