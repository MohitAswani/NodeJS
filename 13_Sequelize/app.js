const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const sequelize = require('./util/database');  

const app = express();

app.set('view engine', 'ejs');

app.set('views', 'views');

app.use(bodyParser.urlencoded({limit: '50mb',extended:true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.getError);

// To ensure that all the modal we created get transferred into tables or get a table that belongs to them whenver we start our application and if the table already exists, it will of course not override it by default though we can tell it to do so.

// Sync is a special method and it has a look at all the models we defined by using sequelize define on the sequelize object hence its aware of all our models. So the sync function will sync our models to the database by creating the appropriate tables and relations.
sequelize.sync()
    .then(result=>{
        app.listen(3000);
    })
    .catch(err=>{
        console.log(err);
    })
