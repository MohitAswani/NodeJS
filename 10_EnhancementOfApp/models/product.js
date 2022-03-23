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
        // //save method used to save data to the our DS.
        // fs.readFile(p, (err, fileContent) => {
        //     let products = [];
        //     if (!err) {
        //         products = JSON.parse(fileContent);
        //     }
        //     products.push(this);  // this here will refer to the class.
        //     fs.writeFile(p, JSON.stringify(products), (err) => {
        //         console.log(err);
        //     });
        // });

        getProductsFromFile(products => {
            products.push(this);  // we must always use arrow function due to the this context.

            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
    }

    // static fetchAll() {
    //     fs.readFile(p, (err, fileContent) => {
    //         if (err) {
    //             return [];
    //         }

    //         return JSON.parse(fileContent)(Product);
    //     });

    //     // the issue with this fetchAll function is that this code is asynchronous and hence the it registers this callback in its registry and then it fineshes with this function and this function does not return anything.

    //     // And the return statements belong to the inner function and not to the fetchAll function. Hence the fetchAll function returns undefined.
    // }

    static fetchAll(cb) {
        // fs.readFile(p, (err, fileContent) => {
        //     if (err) {
        //         cb([]);
        //     }
        //     cb(JSON.parse(fileContent));
        // });

        // So instead of returning something we use the callback feature of js.

        // We pass in a function to fetchAll which will be executed once the readfile is completed.

        // And for the callback function we pass in the function which renders the response in products.js.

        // That call back takes in an array of products.

        // We replace the above code with the below function.
        getProductsFromFile(cb);
    }
};