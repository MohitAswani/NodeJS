const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class User {

    // We delete the cart model since we don't need a seperate model for storing cart , we can just store them in a user model since they have a one to one relation and storing it here makes more sense.

    constructor(username, email, cart, id) {
        this.name = username;
        this.email = email;
        this.cart = cart;   // {items:[]}
        this._id = id;
    }

    save() {
        const db = getDb();

        return db.collection('users').insertOne(this)
            .then(result => {
                console.log(result);
            })
            .catch(err => {
                console.log(err);
            });
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => {
            // return cp.productId===product._id;  // since we are comparing by value as well as type hence we get the wrong answer since js doesn't consider the product._id as string even though we can use it as string.

            return cp.productId.toString() === product._id.toString();
        });   // checking if the product exists in cart or not.

        let newQuantity = 1;

        const updatedCartItems = [...this.cart.items];  // we create a copy of the cart using the spread operator.

        if (cartProductIndex >= 0) { // if the product already exists in the cart.
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity; // we simply update its quantity
        }
        else {  // if the product doesn't exist in the cart.
            updatedCartItems.push({ productId: new mongodb.ObjectId(product._id), quantity: newQuantity });  // we push the product into the cart
        }

        // Below we are creating an object which contains a array of products with all the properties of product and an added property of quantity.

        // const updatedCart={items:[{...product,quantity:1}]};    // here we use the spread operator to get all the properties of product.

        // Since a product's info might be update hence rather than storing a copy of products data we store a reference to the product in the cart.


        const updatedCart = { items: updatedCartItems };

        const db = getDb();

        return db.collection('users').updateOne(
            { _id: new mongodb.ObjectId(this._id) },
            { $set: { cart: updatedCart } }
        );  // here we just want to ovewrite the cart of the user to the updated cart.
    }

    deleteFromCart(product) {
        const db = getDb();

        const updatedItems = this.cart.items.filter(i => {
            return i.productId.toString() !== product._id.toString();
        })

        return db.collection('users').updateOne(
            { _id: new mongodb.ObjectId(this._id) },
            { $set: { cart: { items: updatedItems } } }
        );

    }

    getCart() {

        // The issue with doing this is that if we delete a product and it is still in the cart then the reference to that object stays in the cart even though it has been deleted.

        // To prevent this from happening we can simply check if productsId are more in number than products then we remove some product ids from the database.

        const db = getDb();

        if (this.cart) {
            const productIds = this.cart.items.map(i => {
                return i.productId;
            });  // We map an array of object to an array of ids.
            return db.collection('products')
                .find({ _id: { $in: productIds } })      // we find all the products whose id is present in the cart of the user
                .toArray()
                .then(products => {

                    if (products.length < productIds.length) {    // this will fix the error of cart storing deleted objects

                        this.cart.items = this.cart.items.filter(item => {
                            return products.findIndex(p => {
                                return p._id.toString() === item.productId.toString();
                            }) !== -1
                        });    // we filter our the products not in the retrieved products

                        return db               // then we update our cart accordingly
                            .collection('users')
                            .updateOne(
                                { _id: new mongodb.ObjectId(this._id) },
                                { $set: { cart: this.cart } }
                            ).then(result => {
                                return products;
                            })
                            .catch(err => {
                                console.log(err);
                            })
                    }

                    return products;
                })
                .then(products => {
                    return products.map(p => {
                        return {
                            ...p,
                            quantity: this.cart.items.find(i => {
                                return i.productId.toString() === p._id.toString();
                            }).quantity
                        };

                        // then we want to return an array of js objects with product and its quantity.

                        // To do we first use a map function to convert the array of products to an array of js object with product and its quamtity.

                        // To add the quantity we find the element in this.cart.items (we need to make sure that we use arrow functions so that this refers to the array element) and add its quantity to the js object inside the map function.
                    })
                });
        }

        return [];

    }

    addOrder() {
        const db = getDb();

        // In the below code we are taking all the products from the users cart and embedding them in a order document.
        return this.getCart()
            .then(products => {
                const order = {
                    items: products,         // we need a snapshot of products and its information.
                    userId: this._id
                }
                return db.collection('orders').insertOne(order)
            })
            .then(result => {
                this.cart = { items: [] };   // emptying the cart.
                return db
                    .collection('users')
                    .updateOne(
                        { _id: new mongodb.ObjectId(this._id) },
                        { $set: { cart: this.cart } }
                    );
            });
    }

    getOrders() {
        const db = getDb();

        return db.collection('orders')
            .find({ userId: new mongodb.ObjectId(this._id) })
            .toArray()
    }

    static findById(userId) {
        const db = getDb();

        return db.collection('users')
            .findOne({ _id: new mongodb.ObjectId(userId) })
            .then(user => {
                return user;
            })
            .catch(err => {
                console.log(err);
            });
    }
}


module.exports = User;