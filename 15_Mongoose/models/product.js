const mongoose=require('mongoose');

const Schema=mongoose.Schema;  // this schema constructor allows us to create new schemas.

// The following is how we define a mongoose schema, we pass in our properties to the schema constructor.

// Even though mongodb is schemaless we define a structure for the data we work with and hence we get the advantage of focusing on our data but for that it need to know how our data looks like. 

// We can still deviate from this without setting requirred field.

const productSchema = new Schema({
    title:{
        type:String,
        required:true
    },   
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
});

// Model is a function we call and it is important for mongoose to connect a schema with a name.

// This model is what we will work with.

// Mongoose takes the model name , makes it lowercase and pluralizes it.

module.exports=mongoose.model('Product',productSchema);
