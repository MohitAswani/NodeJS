const Cart = require('../models/cart');
const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.findAll({})
        .then((products) => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All products',
                path: '/products'
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;


    // Sequelize also has a findById method define to find the products by id , the only difference is that instead of returning as nested array it returns an object.

    // With Sequelize v5, findById() was replaced by findByPk().

    // You use it in the same way, so you can simply replace all occurrences of findById() with findByPk()

    // Product.findByPk(prodId)
    //     .then((product) => {
    //         res.render('shop/product-details', {
    //             pageTitle: product.title,
    //             path: '/products',
    //             product: product
    //         });
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });

    // We have a rich amount of options we can use to configure the options object.

    // We can also control the attribute which are retrieved.

    // We can also have operators to have alteranative conditions or to check if something is greater than or greater than equal or lower than a value and so on.

    Product.findAll({where : {
        id:prodId
    }}).then(products=>{

        // By default findAll returns an array hence we need to treat it as an array.

        res.render('shop/product-details', {
            pageTitle: products[0].title,
            path: '/products',
            product: products[0]
        });

    }).catch(err=>console.log(err));

}

exports.getIndex = (req, res, next) => {

    // FindAll is a method used to return all the records for this model.

    // We can pass in some conditions to findAll like where clause to restrict the kind of data we want to retreive.

    Product.findAll({})
        .then((products) => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'Shop from shop.js',
                path: '/',
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getCart = (req, res, next) => {
    Cart.fetchCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (let product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if (cart.products.find(prod => prod.id === product.id)) {
                    cartProducts.push({ productData: product, qty: cartProductData.qty });
                }
            }
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: cartProducts
            })
        });
    });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId.trim();
    Product.findById(prodId, (product) => {
        Cart.addProduct(prodId, product.price);
    })
    res.redirect('/cart');
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your orders'
    })
}


exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    })
};

exports.postDeleteCartProduct = (req, res, next) => {
    let { id, price } = req.body;
    id = id.trim();
    price = price.trim();
    Cart.deleteProduct(id, price);
    res.redirect('/cart');
}

