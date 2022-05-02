const db = require('../util/database');

const cart = require('./cart');


module.exports = class Product {
    constructor(id, title, price, description, image) {
        this.id = id;
        this.title = title
        this.price = price
        this.description = description
        this.image = image
    }

    save() {
        // to safely insert values and not face the issue of SQL injection which is an attack pattern where users can insert special data into your input fields in your webpage that runs as SQL queries.
        // So we use '?' to insert the values and pass in those values as the second argument.
        // console.log(this.title, this.price, this.description, this.image);
        return db.execute('INSERT INTO `products` (`title`, `price`, `description`, `image`) VALUES (?,?,?,?)', [this.title, this.price, this.description, this.image]);
    }

    static fetchAll() {
        return db.execute('SELECT * FROM products');
    }

    static findById(id) {
        return db.execute('SELECT * FROM products WHERE products.id=?', [id]);
    }

    static deleteById(id) {
        return db.execute('DELETE FROM products WHERE products.id=?',[id]);
    }
};