const path = require('path');

const express = require('express');

const router = express.Router();

const rootDir = require('../util/path');

const adminData = require('./admin');

router.get('/', (req, res, next) => {

    // to add data to the template we can pass in the data as the second argument to the render method but as a javascript object. 

    // Also we need to pass in a key name which we can use in the template to refer to the data we are passing in.

    const products = adminData.products;

    // console.log('shop.js',adminData.products);
    // res.sendFile(path.join(rootDir,'views','shop.html'));

    // to render the template we need to tell express to render it and it will automatically use pug to render the template.

    res.render('shop', { prods:products,pageTitle: 'Shop from shop.js',path:'/',hasProducts: products.length > 0 ,mainCSS:true,activeShop:true}); 
    
    // provided by express and it will use the default templating engine.

    // also since we have provided a path to the folder containing the view, we don't to need to provide the path to the file we just need to write its name.


});

module.exports = router;