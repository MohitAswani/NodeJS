const path = require('path');

const express = require('express');

const shopController=require('../controllers/shop');

const router = express.Router();

router.get('/',shopController.getIndex);

router.get('/products',shopController.getProducts);

// Route for a particular product using a dynamic segment.

// Express helps us to extract the dynamic id using the below syntax and we can use the variable name after the : to find that product in our database.

// The : signals to express that productId is a variable and can be anything. So if we have route like /products/delete we must write it above the /products/:productId since express will also consider the delete route as /products/:productId route.

// Hence while using dynamic routes we must take care of the order of routes.

// router.get('/products/delete');

router.get('/products/:productId',shopController.getProduct);

router.get('/cart',shopController.getCart);

router.post('/cart',shopController.postCart);

router.get('/orders',shopController.getOrders);

router.get('/checkout',shopController.getCheckout);

router.post('/cart-delete-item',shopController.postDeleteCartProduct);

module.exports = router;