const path = require('path');

const express = require('express');

const mongoose = require('mongoose');

// const User = require('./models/user');

const errorController = require('./controllers/error');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//     User.findById('6279177a13fd9996d409bcf4')
//         .then(user => {
//             req.user = new User(user.name, user.email, user.cart, user._id);
//             next();
//         })
//         .catch(err => {
//             console.log(err);
//         });
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.getError);

// In mongoose we don't need to write any code for connection it does it all for us.

mongoose.connect('mongodb+srv://aswanim96:Mohit1234@cluster0.o2of3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
    .then(result => {
        console.log('Connection successful');
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });