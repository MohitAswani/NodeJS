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

    // Build creates a new element in the javascript but doesn't save it to the database.

    // Create creates a new element based on that model and immediately saves it to the database.

    // Also just like mysql worked with promises so does sequelize so we can attack callback to the functions returning promises using then and catch

    Product.create({
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        image: req.body.image
    })
        .then(result => {
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        });
}


exports.getEditProduct = (req, res, next) => {

    // We can use the query params to pass in more data through the url 
    // Query params begin with ? and are seperated with '&'

    const editMode = req.query.edit;

    if (!editMode) {
        return res.redirect('/');
    }

    const prodId = req.params.productId;

    Product.findByPk(prodId)
        .then(product => {
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

    // To update the product details we first find the product by id and then we save the updated details.
    // To save the updated object in the database we call the save method on the database.
    // The save method takes the product as we edit it and saves it back to the database, if the product doesn't it will create a new one else it will update the exist product.
    Product.findByPk(id)
        .then(product => {
            product.title = title;
            product.price = price;
            product.description = description;
            product.image = image;
            return product.save();
        }) // the below then will handle response from the above return statement.
        .then(result => {
            console.log("Updated product");
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        })
};

exports.getProducts = (req, res, next) => {
    Product.findAll({})
        .then(products => {
            res.render('admin/products', {
                prods: products,
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

    // We delete a database entry we can call destroy function and the destroy function allows us to destroy any entry we find through our options like where condition.


    // Product.destroy({
    //     where: {
    //         id: id
    //     }
    // })
    //     .then(() => {
    //         res.redirect('/admin/products');
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });

    // Another approach to solve this problem is to find the object by id and call the destroy function on that product.

    Product.findByPk(id)
        .then(product => {
            return product.destroy();
        })
        .then(result => {
            console.log("DESTROYED PRODUCT");
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};