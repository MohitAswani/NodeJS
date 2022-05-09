const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const db = require('./util/database');  // exporting this will give us the pool which allows us to use the connections in it.

const app = express();

app.set('view engine', 'ejs');

app.set('views', 'views');

// we use the below line to execute a SQL query.
// Promises have two functions : 1)then 2)catch
// We can chain these function to the promise and they handle the promise.
// We use promises because they save from using nested callback and help us in writing more structured code.
// The then block gets the anonymous function to execute when the promise is returned.
// The catch block takes a function which executes in case of an error. 

// db.execute('SELECT * FROM products')
//     .then((result)=>{
//         console.log(result[0]); // result is an nested array with 2 elements : 0- with the rows and 1-with the metadata.
//     })
//     .catch((err)=>{
//         console.log(err);
//     });

app.use(bodyParser.urlencoded({limit: '50mb',extended:true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.getError);

app.listen(3000);