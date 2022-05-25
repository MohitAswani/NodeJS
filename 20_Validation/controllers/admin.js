const Product = require('../models/product');

const mongodb = require('mongodb');
const {validationResult} = require('express-validator');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        product: {},
        hasError:false,
        errorMessage:null,
        validationErrors:[]
    });
};

exports.postAddProduct = (req, res, next) => {
    const { title, price, description, image } = req.body;
    const errors = validationResult(req);

    if(!errors.isEmpty())
    {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            hasError:true,
            product: {
                title:title,
                price:price,
                image:image,
                description:description
            },
            errorMessage:errors.array()[0].msg,
            validationErrors:errors.array()
        });
    }

    const product = new Product({
        title: title,
        price: price,
        description: description,
        image: image,
        userId: req.user._id
    });

    product
        .save()
        .then(result => {
            console.log('CREATED PRODUCT');
            res.redirect('/admin/products');
        }).catch(err => {
            console.log(err);
        });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;

    if (!editMode) {
        return res.redirect('/');
    }

    const prodId = req.params.productId;

    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            else {
                res.render('admin/edit-product', {
                    pageTitle: 'Edit Product',
                    path: '/admin/edit-product',
                    editing: true,
                    product: product,
                    hasError:false,
                    errorMessage:null,
                    validationErrors:[],
                });
            }
        })
        .catch(err => {
            console.log(err);
        })
};

exports.postEditProduct = (req, res, next) => {
    let id = req.body.id
    let { title, price, description, image } = req.body;
    id = id.trim();
    title = title.trim();
    price = parseFloat(price);
    description = description.trim();
    image = image.trim();

    const errors = validationResult(req);

    if(!errors.isEmpty())
    {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: true,
            hasError:true,
            product: {
                _id:id,
                title:title,
                price:price,
                image:image,
                description:description
            },
            validationErrors:errors.array(),
            errorMessage:errors.array()[0].msg
        });
    }

    Product.findById(id)
        .then(product => {

            // We prevent the user from editing the product he didnot create.
            if (product.userId.toString() !== req.user._id.toString()) {        
                return res.redirect('/');
            }

            product.title = title;
            product.price = price;
            product.description = description;
            product.image = image;
            return product.save()
                .then(result => {
                    console.log('UPDATED PRODUCT');
                    res.redirect('/admin/products');
                })
        })
        .catch(err => {
            console.log(err);
        })
};

exports.getProducts = (req, res, next) => {

    // We restrict only the user who added these products to edit and delete them.

    Product.find({ userId: req.user._id })
        .populate('userId', 'name')
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
            });
        })
        .catch(err => {
            console.log(err);
        });


};

exports.postDeleteProduct = (req, res, next) => {
    let { id } = req.body;
    id = id.trim();

    // We prevent the user from deleting the product he didnot create.
    Product.deleteOne({_id:id,userId:req.user._id})
        .then(() => {
            console.log("PRODUCT DELETED");
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};