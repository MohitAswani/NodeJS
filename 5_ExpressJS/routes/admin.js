const path=require('path');

const express = require('express');

const rootDir=require('../util/path');

// the below function creates a router.

// the router is like a mini express app tied to the other express app or pluggable into other express app which we can export here.

const router = express.Router();

// in the below we are registering the routes.
 
// /admin/add-product => GET
router.get('/add-product', (req, res, next) => {

    // res.sendFile(path.join(__dirname,'..','views','add-product.html'));

    // so basically instead of passing the root directory as __direname+'..' we pass it as below

    res.sendFile(path.join(rootDir,'views','add-product.html'));

});

// /admin/product => POST
router.post('/product', (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});


module.exports = router;