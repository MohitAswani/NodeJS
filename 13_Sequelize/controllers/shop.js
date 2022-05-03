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
    let { id} = req.body;
    id = id.trim();

    req.user.getCart()
    .then(cart=>{
        return cart.getProducts({where:{id:id}});
    })
    .then(products=>{
        const product=products[0];
        return product.cartItem.destroy();
    })
    .then(result=>{
        res.redirect('/cart');
    })
    .catch(err=>{
        console.log(err);
    })   
}

