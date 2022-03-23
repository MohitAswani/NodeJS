const path = require('path');

const express = require('express');

const productsController = require('../controllers/products')

const router = express.Router();

router.get('/add-product', productsController.getAddProduct);

// We don't put the parentheses in getAddProduct function since we don't want to execute it rather we just want to pass its reference. So it will execute the code only when it encounters the respective request.

router.post('/add-product', productsController.postAddProduct);

module.exports=router;