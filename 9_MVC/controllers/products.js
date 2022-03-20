const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        mainCSS: true,
        productCSS: true,
        activeAddProduct: true
    });
};

exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title, req.body.price, req.body.description, req.body.image);
    product.save();
    res.redirect('/');
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        console.log(products);
        res.render('shop', {
            prods: products,
            pageTitle: 'Shop from shop.js',
            path: '/',
            hasProducts: products.length > 0,
            mainCSS: true,
            activeShop: true
        });
    });
};