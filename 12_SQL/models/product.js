const fs = require('fs');
const path = require('path');
const file = require('../data/products.json');
const cart=require('./cart');
const p = path.join(
    path.dirname(require.main.filename),
    'data',
    'products.json');

const getProductsFromFile = cb => {
    cb(file);
};

module.exports = class Product {
    constructor(id, title, price, description, image) {
        this.id = id;
        this.title = title
        this.price = price
        this.description = description
        this.image = image
    }

    save() {
        getProductsFromFile(products => {
            if (this.id) {
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                const updateProducts = [...products];
                updateProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updateProducts), (err) => {
                    console.log(err);
                });
            }
            else {
                this.id = Math.random().toString();
                products.push(this);  // we must always use arrow function due to the this context.

                fs.writeFile(p, JSON.stringify(products), (err) => {
                    console.log(err);
                });
            }
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static findById(id, cb) {
        getProductsFromFile(products => {

            // We use the default JS find method which executes a function we pass to it on every element of the JS array and return the element which satisfies that condition.
            const product = products.find(prod => prod.id === id);
            cb(product);
        })
    }

    static deleteById(id, cb) {
        getProductsFromFile(products => {
            const updatedProducts = products.filter(prod => prod.id !== id);
            const product=products.find(prods=>prods.id===id);
            fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                if (!err) {
                    cart.deleteProduct(product.id,product.price);
                }
            });
        });
    }
};