const fs = require('fs');
const path = require('path');
const file=require('../data/products.json');
const p = path.join(
    path.dirname(require.main.filename),
    'data',
    'products.json');

const getProductsFromFile = cb => {
    cb(file);
};

module.exports = class Product {
    constructor(title, price, description, image) {
        this.title = title
        this.price = price
        this.description = description
        this.image = image
    }

    save() {
        getProductsFromFile(products => {
            products.push(this);  // we must always use arrow function due to the this context.

            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }
};