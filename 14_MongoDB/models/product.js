const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
    constructor(title, price, description, image, id, userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.image = image;
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.userId = userId;
    }

    save() {
        const db = getDb();

        // mongo has the following level : database => collections => documents

        // The following method is used to access any collection and if the collection doesn't exist it will create that collection.

        let dbOp;

        if (this._id) {
            console.log(this._id);
            dbOp = db
                .collection('products')
                .updateOne({ _id: this._id }, { $set: this });  // will simply instruct mongo to set the key values in the document to these values.
        }
        else {
            dbOp = db
                .collection('products')
                .insertOne(this);
        }

        return dbOp
            .then(result => {
                console.log(result);
            })
            .catch(err => {
                console.log(err);
            });

        // will insert one document and return a promise.

        // db.collection('products').insertMany();  // will insert many document 
    }

    static fetchAll() {
        const db = getDb();

        return db.collection('products')
            .find()
            .toArray()
            .then(products => {
                return products;
            })
            .catch(err => {
                console.log(err);
            });

        // will return a cursor which is an object provided by mongodb which allows us to go through our elements, our documents step by step (just like iterators and it helps in pagination).

        // we use toArray to tell mongodb that we want all the documents at once and as an array.

        // we only do this when we know that we are only fetching very less documents.
    }

    static findById(prodId) {
        const db = getDb();

        return db.collection('products')
            .find({ _id: new mongodb.ObjectId(prodId) })
            .next()           // since it still giving us cursor we will get the next object which is the first one.
            .then(product => {
                return product;
            })
            .catch(err => {
                console.log(err);
            })
    }

    static deleteById(prodId) {
        const db = getDb();

        return db.collection('products')
            .deleteOne({ _id: new mongodb.ObjectId(prodId) })
            .then(result => {
            })
            .catch(err => {
                console.log(err);
            })
    }
}

module.exports = Product;
