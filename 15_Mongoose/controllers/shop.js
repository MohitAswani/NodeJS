const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
    Product.find()   // also returns a cursor so for large amount of data we use that
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All products',
                path: '/products'
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)  // this is also a mongoose function
        .then(product => {
            res.render('shop/product-details', {
                pageTitle: product.title,
                path: '/products',
                product: product
            });
        }).catch((err) => {
            console.log(err);
        });
}

exports.getIndex = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'Shop from shop.js',
                path: '/',
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')    // this does return a promise
        .then(user => {
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: user.cart.items
            })
        })
        .catch(err => {
            console.log(err);
        })
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId.trim();
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getOrders = (req, res, next) => {

    // Following is how we make a search by nested query.
    
    Order.find({'user.userId':req.user._id})
        .then(orders => {
            console.log(orders);
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your orders',
                orders: orders
            });
        })
        .catch(err => {
            console.log(err);
        });
}


exports.postDeleteCartProduct = (req, res, next) => {
    let { id } = req.body;
    id = id.trim();

    Product.findById(id)
        .then(product => {
            return req.user.deleteFromCart(product);
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')    // this does return a promise
        .then(user => {

            // productId holds the whole info about a product.

            // So to extract the whole product info rather than the id we can use the spread operator and create a new js object but we don't use the spread operator on the productId but on a special field provided by mongoose.

            // The _doc allows us to access the data in the object and then with the spread operator inside of a new object we pull out all the data in that document we retrieved and store it in a new object which we save here.

            const products = user.cart.items.map(i => {
                return { quantity: i.quantity, product: {...i.productId._doc} };
            });
            const order = new Order({
                user: {
                    name: req.user.name,
                    userId: req.user._id
                },
                products: products
            });
            return order.save();
        })
        .then(result => {
            req.user.cart.items=[];
            return req.user.save();
        })
        .then(result=>{
            res.redirect('/orders');
        })
        .catch(err => {
            console.log(err);
        })
}

