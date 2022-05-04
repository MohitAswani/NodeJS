const Cart = require('../models/cart');
const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.findAll()
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

    // For finding a product by id we can either do find by primary key

    // Product.findByPk(prodId)
    //     .then(product => {
    //         res.render('shop/product-details', {
    //             pageTitle: product.title,
    //             path: '/products',
    //             product: product
    //         });
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });

    // Or we can use where syntax in findAll method to find by a specific id
    Product.findAll({
        where: {
            id: prodId
        }
    }).then(products => {
        res.render('shop/product-details', {
            pageTitle: products[0].title,
            path: '/products',
            product: products[0]
        });
    }).catch((err) => {
        console.log(err);
    });
}

exports.getIndex = (req, res, next) => {
    Product.findAll()
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

    // Cart.fetchCart(cart => {
    //     Product.fetchAll(products => {
    //         const cartProducts = [];
    //         for (let product of products) {
    //             const cartProductData = cart.products.find(prod => prod.id === product.id);
    //             if (cart.products.find(prod => prod.id === product.id)) {
    //                 cartProducts.push({ productData: product, qty: cartProductData.qty });
    //             }
    //         }
    //         res.render('shop/cart', {
    //             path: '/cart',
    //             pageTitle: 'Your Cart',
    //             products: cartProducts
    //         })
    //     });
    // });
    req.user.getCart()
        .then(cart => {
            return cart.getProducts();
        })
        .then(products => {

            // we get an error since we tried to access nested data whereas in this case we just have normal products we get from our table along with all their methods and objects.

            // Since products is an array of sequelize object we can also access the cartItem (item of the in-between table) refering to the product and we can access the quantity.

            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products
            })
        })
        .catch(err => {
            console.log(err);
        })
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId.trim();

    let fetchedCart;
    let newQuantity = 1;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: prodId } });
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }

            // Case when the product is already in the cart
            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                // return fetchedCart.addProduct(product, {
                //     through: {
                //         quantity: newQuantity
                //     }
                // });

                return product; // automatically wraped in product
            }

            return Product.findByPk(prodId);
            // .then(product => {

            //     // this method will add the entry related to these two element in the in-between table and for that we also need to pass in the extra field we defined which is quantity.

            //     // we add this extra field by passing an object to add product as the second argument and we do this by using through which tells sequalize that for the in-between table here is the in-between table here is some additional information that we need to set the values for.

            //     return fetchedCart.addProduct(product, {
            //         through: {
            //             quantity: newQuantity
            //         }
            //     })
            // })
        })
        .then(product => {
            return fetchedCart.addProduct(product, {
                through: {
                    quantity: newQuantity
                }
            })
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getOrders = (req, res, next) => {

    // If we also want to fetch the related products to an order, we have to pass an object where we set include to an array with the field products or the element products as a string. We do this because we associated an order to many product (which will be pluralized to products). Then we use a concept called eager loading where we basically instruct sequelize to fetch all related products to the order and give back an array of order which also includes the products per order (this works because we have a relation between order and products).
    req.user.getOrders({include:['products']})
    .then(orders=>{
        res.render('shop/orders', {
            path: '/orders',
            pageTitle: 'Your orders',
            orders:orders
        });
    })
    .catch(err=>{
        console.log(err);
    });
}


exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    })
};

exports.postDeleteCartProduct = (req, res, next) => {
    let { id } = req.body;
    id = id.trim();

    req.user.getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: id } });
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        })
};

exports.postOrder = (req, res, next) => {

    let fetchedCart;
    req.user.getCart()
        .then(cart => {
            fetchedCart=cart;
            return cart.getProducts();
        })
        .then(products => {
            return req.user.createOrder()
                .then(order => {

                    // In the below case we can't use through and pass the quantity since we don't have a single quantity  variable rather we need to iterate through quantity of all the products.

                    // To add the quantity field in the products array we use map method which is a default js method that runs on an array and returns a new array with slight modified elements.

                    return order.addProducts(products.map(product => {

                        // Here we add orderItem which refers to the model for the in between table and we set it to a js object. (THE NAME OF THE ITEM WE SET SHOULD BE THE SAME AS THE ONE WE DEFINED IN OUR MODEL).

                        // We get the quantity from the cartItem and store it in the orderItem.

                        product.orderItem = { quantity: product.cartItem.quantity };
                        return product;
                    }));
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .then(result=>{
            return fetchedCart.setProducts(null);
        })
        .then(result=>{
            res.redirect('/orders');
        })
        .catch(err => {
            console.log(err);
        })
}

