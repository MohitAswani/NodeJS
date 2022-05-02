const fs = require('fs');
const path = require('path');
const cart = require('../data/cart.json');
const p = path.join(
    path.dirname(require.main.filename),
    'data',
    'cart.json');

const getCartFromFile=cb=>{
    cb(cart);
}
module.exports = class Cart {

    static addProduct(id, productPrice) {


        const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
        const existingProduct = cart.products[existingProductIndex];
        let updatedProduct;


        if (existingProduct) {

            updatedProduct = { ...existingProduct };

            updatedProduct.qty = updatedProduct.qty + 1;
            cart.products = [...cart.products];

            cart.products[existingProductIndex] = updatedProduct;
        }
        else {
            updatedProduct = { id: id, qty: 1 };
            cart.products = [...cart.products, updatedProduct]
        }

        cart.totalPrice = cart.totalPrice + +productPrice;

        fs.writeFile(p, JSON.stringify(cart), (err) => {
            console.log(err);
        });
    }

    static deleteProduct(id,productPrice){
        const updatedProducts={...cart};
        const deleteProduct=updatedProducts.products.find(prod=>prod.id===id);
        if(deleteProduct){
            const deleteProductQuantity=deleteProduct.qty;
            updatedProducts.products=updatedProducts.products.filter(prods=>prods.id!==id);
            cart.totalPrice=-deleteProductQuantity*productPrice;
            fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                console.log(err);
            });
        }
    }

    static fetchCart(cb){
        getCartFromFile(cb);
    }


}