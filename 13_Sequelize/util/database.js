const Sequelize = require('sequelize');

const sequelize = new Sequelize('node_schema', 'root', 'Mohit1234', { dialect: 'mysql', host: 'localhost' });

module.exports=sequelize;  // this will give us the connection pool just like the one we created using mysql2.