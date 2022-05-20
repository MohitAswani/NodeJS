const fs = require('fs');
const path = require('path');

const PDFDocument = require('pdfkit');

const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All products',
                path: '/products',
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
    Product.find()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'Shop from shop.js',
                path: '/',
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


exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;

    Order.findById(orderId)
        .then(order => {

            if (!order) {
                return next(new Error('No such order found'));
            }


            // In the below code we make sure that only the person who is trying to access the invoice is the one whose order it is.

            if (order.user.userId.toString() !== req.user._id.toString()) {
                let error = new Error('User not authorized');
                error.httpStatusCode = 404;
                return next(error);
            }

            const invoiceName = 'invoice-' + orderId + '.pdf';

            // we generate the path of the file.

            const invoicePath = path.join('data', 'invoices', invoiceName);

            // We use the constructor to create a new pdf document.

            // This also is a readable stream.

            const pdfDoc = new PDFDocument();

            // We pipe this output into a writable file stream and to the stream we pass a path where we want to write it to.

            // This ensures that pdf we generate here also get stored on the server and not just served to the client.

            pdfDoc.pipe(fs.createWriteStream(invoicePath));

            // Since we also want to return it to the client we also pipe it to a response which is writable read stream.

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');

            pdfDoc.pipe(res);

            // this add a line of text to the pdf.
            // pdfDoc.text('heelo world');

            pdfDoc.fontSize(32).text('Invoice', {
                underline: true
            });

            pdfDoc.moveDown(1);

            let totalPrice= 0;

            order.products.forEach(p => {
                totalPrice+=p.quantity*p.product.price;
                pdfDoc.fontSize(14).text(`${p.product.title} - ${p.quantity} x  $ ${p.product.price}`);
            });

            pdfDoc.moveDown(1);

            pdfDoc.text('-----------------------------------');

            pdfDoc.moveDown(1);
            
            pdfDoc.fontSize(18).text(`Total price : ${totalPrice}`);

            // when we are done writing we call the below function.
            pdfDoc.end();

            // To download the invoice we use the fs to get the file.

            // If we read the file in this way , node will first of all access the file, read the entire content into memory and then return it with the response.

            // This means that for bigger files, this will take very long before a response is sent and our memory on the server might actually overflow becuase it has to read all the data into memory which is limit.

            // Reading file data into memory for response is not a good practise specially for bigger file.

            // So we should be streaming our data.

            // fs.readFile(invoicePath, (err, data) => {
            //     if (err) {
            //         return next(err);
            //     }

            //     res.setHeader('Content-Type', 'application/pdf');
            //     res.setHeader('Content-Disposition', 'attachment; filename="' + invoiceName + '"');
            //     res.send(data);  // this will send the file.
            // });

            // So in the below we have the read stream and node will be able to use that to read in the file step by step in different chunks.

            // const file = fs.createReadStream(invoicePath);

            // res.setHeader('Content-Type', 'application/pdf');
            // res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');

            // we call the pipe to forward the data that is read in with the stream to my response becuase the response object is a writable stream actually and we can use readable streams to pipe their output into a writable stream.

            // So the response will be stream to the browser and will contain the data and the data will basically be download by the browser step by step and for large files this is huge advantage since node doesn't have to preload the data into memory.

            // file.pipe(res);
        })
        .catch(err => {
            next(err);
        })

}
