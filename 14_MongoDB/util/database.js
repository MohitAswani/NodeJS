const Sequelize = require('sequelize');  

const sequelize = new Sequelize('node_schema', 'root', 'Mohit1234', { 
    dialect: 'mysql',
    host: 'localhost' 
}); 

module.exports=sequelize; 