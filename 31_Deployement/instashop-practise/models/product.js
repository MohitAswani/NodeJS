const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    stripeProductId: {
        type:String,
        required:true,
    },
    stripePriceId: {
        type:String,
        required:true,
    }
});


module.exports = mongoose.model('Product', productSchema);
