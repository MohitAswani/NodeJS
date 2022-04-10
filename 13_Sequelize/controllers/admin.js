const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {

    // Now we only use edit-product to add product since we are using the same form for both.

    // But we do not change the path in the below function since we want the rest of the behaviour to stay the same.

    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        product: {}
    });
};

exports.postAddProduct = (req, res, next) => {
    const product = new Product(null, req.body.title, req.body.price, req.body.description, req.body.image);
    product.save()
        .then(() => {
            res.redirect('/');
        });
};

exports.getEditProduct = (req, res, next) => {

    // We can use the query params to pass in more data through the url 
    // Query params begin with ? and are seperated with '&'

    const editMode = req.query.edit;

    if (!editMode) {
        return res.redirect('/');
    }

    const prodId = req.params.productId;

    Product.findById(prodId, product => {
        if (!product) {
            return res.redirect('/');
        }
        else {
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: true,
                product: product
            });
        }
    });
};

exports.postEditProduct = (req, res, next) => {
    let id = req.body.id
    let { title, price, description, image } = req.body;
    id = id.trim();
    title = title.trim();
    price = parseFloat(price);
    description = description.trim();
    image = image.trim();

    const newProduct = new Product(id, title, price, description, image);
    newProduct.save();
    res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(([rows, fieldData]) => {
            res.render('admin/products', {
                prods: rows,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postDeleteProduct = (req, res, next) => {
    let { id } = req.body;
    id = id.trim();
    Product.deleteById(id)
        .then(() => {
            res.redirect('/admin/products');
        })
        .catch((err) => {
            console.log(err);
        });
};