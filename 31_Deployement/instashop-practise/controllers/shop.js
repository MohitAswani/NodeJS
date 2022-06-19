
const PDFDocument = require('pdfkit');
const stripe = require('stripe')(process.env.TEST_SECRET_KEY);

const {uploadFile} = require('../util/s3');

const Product = require('../models/product');
const Order = require('../models/order');

const ITEMS_PER_PAGE = require('../util/constants');

exports.getProducts = (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    let totalItems;

    Product.find().countDocuments().then(numProducts => {
        totalItems = numProducts;
        return Product.find()
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE)
    })
        .then(products => {
            res.render('shop/product-list.ejs', {
                prods: products,
                pageTitle: 'Products',
                path: '/products',
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * parseInt(page) < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            res.render('shop/product-details', {
                pageTitle: product.title,
                path: '/products',
                product: product,
            });
        }).catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.getIndex = (req, res, next) => {

    const page = parseInt(req.query.page) || 1;

    let totalItems;

    Product.find().countDocuments().then(numProducts => {
        totalItems = numProducts;
        return Product.find()
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE)
    })
        .then(products => {
            res.render('shop/index.ejs', {
                prods: products,
                pageTitle: 'Shop',
                path: '/',
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * parseInt(page) < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.filter(p => {
                return p.productId !== null;
            });

            if (products.length < user.cart.items.length) {
                user.cart.items = products;
                user.save()
                    .then(result => {
                        return res.render('shop/cart', {
                            path: '/cart',
                            pageTitle: 'Your Cart',
                            products: products,
                        })
                    })
            }
            else {
                res.render('shop/cart', {
                    path: '/cart',
                    pageTitle: 'Your Cart',
                    products: products,
                })
            }
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
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
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.getOrders = (req, res, next) => {

    Order.find({ 'user.userId': req.user._id })
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your orders',
                orders: orders,
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
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
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getCheckout = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.filter(p => {
                return p.productId !== null;
            });

            let total = 0;
            products.forEach(p => {
                total += p.quantity * p.productId.price;
            });

            if (products.length < user.cart.items.length) {
                user.cart.items = products;
                user.save()
                    .then(result => {
                        return res.render('shop/checkout', {
                            path: '/checkout',
                            pageTitle: 'Checkout',
                            products: products,
                            totalSum: total
                        })
                    })
            }
            else {
                return res.render('shop/checkout', {
                    path: '/checkout',
                    pageTitle: 'Checkout',
                    products: products,
                    totalSum: total
                })
            }
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {

            const products = user.cart.items.map(i => {
                return { quantity: i.quantity, product: { ...i.productId._doc } };
            });
            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user._id
                },
                products: products
            });
            return order.save();
        })
        .then(result => {
            req.user.cart.items = [];
            return req.user.save();
        })
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.checkoutSession = (req, res, next) => {

    let products;
    let line_items;
    let total = 0;

    req.user
        .populate('cart.items.productId')
        .then(user => {
            products = user.cart.items.filter(p => {
                return p.productId !== null;
            });

            products.forEach(p => {
                total += p.quantity * p.productId.price;
            });

            line_items = products.map(p => {
                return {
                    price: p.productId.stripePriceId,
                    quantity: p.quantity
                }
            });

            if (products.length < user.cart.items.length) {
                user.cart.items = products;
                return user.save()
            }

            return user;
        })
        .then(result => {
            return stripe.checkout.sessions.create({
                line_items: line_items,
                mode: 'payment',
                success_url: `${process.env.DOMAIN}/checkout-success`,
                cancel_url: `${process.env.DOMAIN}/checkout-failure`,
            })
                .then(session => {
                    res.redirect(303, session.url);
                })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });


}

exports.checkoutSucess = (req, res, next) => {

    req.user
        .populate('cart.items.productId')
        .then(user => {

            const products = user.cart.items.map(i => {
                return { quantity: i.quantity, product: { ...i.productId._doc } };
            });
            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user._id
                },
                products: products
            });
            return order.save();
        })
        .then(result => {
            req.user.cart.items = [];
            return req.user.save();
        })
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;

    Order.findById(orderId)
        .then(order => {

            if (!order) {
                return next(new Error('No such order found'));
            }

            if (order.user.userId.toString() !== req.user._id.toString()) {
                let error = new Error('User not authorized');
                error.httpStatusCode = 404;
                return next(error);
            }

            const invoiceName = 'invoice-' + orderId + '.pdf';
            const pdfDoc = new PDFDocument();

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');

            pdfDoc.pipe(res);

            pdfDoc.fontSize(32).text('Invoice', {
                underline: true
            });

            pdfDoc.moveDown(1);

            let totalPrice = 0;

            order.products.forEach(p => {
                totalPrice += p.quantity * p.product.price;
                pdfDoc.fontSize(14).text(`${p.product.title} - ${p.quantity} x  $ ${p.product.price}`);
            });

            pdfDoc.moveDown(1);

            pdfDoc.text('-----------------------------------');

            pdfDoc.moveDown(1);

            pdfDoc.fontSize(18).text(`Total price : ${totalPrice}`);

            pdfDoc.end();

            uploadFile(pdfDoc,invoiceName);
        })
        .catch(err => {
            next(err);
        })

}

