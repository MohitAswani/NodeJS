const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        require:true,
    },
    creator:{
        type:String,
        required:true
    }
},{
    timestamps:true               // will automatically timestamp when a new version is added.
});

module.exports=mongoose.model('Post',postSchema);