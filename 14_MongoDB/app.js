const path = require('path');

const express = require('express');

const User = require('./models/user');

const errorController = require('./controllers/error');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const mongoConnect = require('./util/database').mongoConnect;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('6279177a13fd9996d409bcf4')
        .then(user => {

            // req.user = user;   // in mongo (not in mongoose) we only get the data from the user object and methods aren't stored there.
            
            // To create an object with which we can interact we create js object using the data provided by mongo.

            req.user=new User(user.name,user.email,user.cart,user._id); 
            next();
        })
        .catch(err => {
            console.log(err);
        });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.getError);

mongoConnect(() => {
    app.listen(3000);
});
