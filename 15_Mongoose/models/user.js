const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    }
});

// Every schema has a methods key, which allows us to add our own methods by simply adding them.

// Also these should be a function so that the this keyword refers to the schema. 

// This method will be called on a real instance based on that schema so on an object which will have a cart.

userSchema.methods.addToCart = function (product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    }
    else {
        updatedCartItems.push({
            productId: product._id,   // mongoose will automatically wrap it in object id.
            quantity: newQuantity
        });
    }

    const updatedCart = {
        items: updatedCartItems
    };

    this.cart = updatedCart;
    return this.save();    // save method will save the changes made to the object.
}

userSchema.methods.deleteFromCart = function (product) {
    const updatedItems = this.cart.items.filter(i => {
        return i.productId.toString() !== product._id.toString();
    })

    this.cart.items = updatedItems;

    return this.save();
}

userSchema.methods.addOrder = function () {
    // return this.

    //     .then(products => {
    //         const order = {
    //             items: products,         // we need a snapshot of products and its information.
    //             userId: this._id
    //         }
    //         return db.collection('orders').insertOne(order)
    //     })
    //     .then(result => {
    //         this.cart = { items: [] };   // emptying the cart.
    //         return db
    //             .collection('users')
    //             .updateOne(
    //                 { _id: new mongodb.ObjectId(this._id) },
    //                 { $set: { cart: this.cart } }
    //             );
    //     });
}

module.exports = mongoose.model('User', userSchema);