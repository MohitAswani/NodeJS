const Sequelize=require('sequelize'); // class/constructor function

const sequelize=require('../util/database');

// the first paramter in define function is the table name (the table name will be pluralized) and second paramater is a JS object which will list all of our fields in the object.

const Product=sequelize.define('product',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    title: Sequelize.STRING,
    price:{
        type:Sequelize.DOUBLE,
        allowNull:false
    },
    image:{
        type:Sequelize.STRING,
        allowNull:false
    },
    description:{
        type:Sequelize.STRING,
        allowNull:false
    }
});         

// defining a new model.

// To add more options to the fields in a product refer to https://sequelize.org/docs/v6/core-concepts/model-basics/.

module.exports=Product;
