const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {

    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        product: {}
    });
};

exports.postAddProduct = (req, res, next) => {
    const { title, price, description, image } = req.body;
    console.log(title, price, description, image);

    // req.user is a sequelize object with all its methods.

    // Hence req.user will have a createProduct method. This is a type of special method which sequelize adds for association and these methods differ based on different type of associations. 

    // For a belongsTo and hasMany association sequelize adds methods that allow us for example to create new associated objects.

    // Here we have createProduct method because our other table is named product.

    req.user.createProduct({
        title: title,
        price: price,
        description: description,
        image: image,
    }).then(result => {
        console.log('CREATED PRODUCT');
        res.redirect('/admin/products');
    }).catch(err => {
        console.log(err);
    });

    // Call create() function on the sequelize model will save the model immediately whereas build will first create a js object and we will have to save that object manually.

    // Product.create({
    //     title: title,
    //     price: price,
    //     description: description,
    //     image: image,
    //     // userId:req.user.id  // Here we are setting the user id manually there is better way of doing this
    // }).then(result => {
    //     console.log('CREATED PRODUCT');
    //     res.redirect('/admin/products');
    // }).catch(err => {
    //     console.log(err);
    // });
};

exports.getEditProduct = (req, res, next) => {

    // We can use the query params to pass in more data through the url 
    // Query params begin with ? and are seperated with '&'

    const editMode = req.query.edit;

    if (!editMode) {
        return res.redirect('/');
    }

    const prodId = req.params.productId;

    // Following is a magic method provided by associated to retrieve a product with the userId=currentUsersId and prodId=the requested product's id.

    req.user.getProducts({ where: { id: prodId } })
        .then(products => {

            const product=products[0]

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

    // Product.findByPk(prodId)
    //     .then(product => {
    //         if (!product) {
    //             return res.redirect('/');
    //         }
    //         else {
    //             res.render('admin/edit-product', {
    //                 pageTitle: 'Edit Product',
    //                 path: '/admin/edit-product',
    //                 editing: true,
    //                 product: product
    //             });
    //         }
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     })
};

exports.postEditProduct = (req, res, next) => {
    let id = req.body.id
    let { title, price, description, image } = req.body;
    id = id.trim();
    title = title.trim();
    price = parseFloat(price);
    description = description.trim();
    image = image.trim();

    Product.findByPk(id)
        .then(product => {
            product.title = title;
            product.price = price;
            product.description = description;
            product.image = image;

            // To update the product and save it back in the database , if the product doesn't exist it will create one else it will ovewrite or update the old one with our new values.

            // Here we can again chain then and catch but rather we return the promise so that we can add sequential then-catch.
            return product.save();
        })
        .then(result => {
            console.log('UPDATED PRODUCT');

            // We need to add the redirect here so that we can see the updated values in the admin products page.
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        })
};

exports.getProducts = (req, res, next) => {

    req.user.getProducts()
    // Product.findAll()
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

    // The below two functions show 2 ways to delete a product from the database.

    // Using options in destroy

    // Product.destroy({
    //     where: {
    //         id: id
    //     }
    // })
    //     .then(() => {
    //         res.redirect('/admin/products');
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });

    // Using findByPk and calling destroy on the returned object.

    Product.findByPk(id)
        .then(product => {
            return product.destroy();
        })
        .then(() => {
            console.log("PRODUCT DELETED");
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};