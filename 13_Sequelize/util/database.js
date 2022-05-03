const Sequelize = require('sequelize');  // here we are importing a constructor function or a class 

const sequelize = new Sequelize('node_schema', 'root', 'Mohit1234', { 
    dialect: 'mysql',
    host: 'localhost' 
}); 
// we instatiate a sequelize object.
// Sequelize( dbname , username , password , options )


// Here we are creating a Sequelize object which will automatically set up a connection pool just like the last module.

module.exports=sequelize;  // database connection pool managed by sequelize.