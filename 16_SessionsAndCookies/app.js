const path = require('path');

const express = require('express');

const mongoose = require('mongoose');

const User = require('./models/user');

const errorController = require('./controllers/error');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('627b5ae2498197c6cdd07cad')
        .then(user => {
            req.user = user;   // this is a full mongoose model so we can call all the mongoose methods on this user
            next();
        })
        .catch(err => {
            console.log(err);
        });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.getError);

mongoose.connect('mongodb+srv://aswanim96:Mohit1234@cluster0.o2of3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
    .then(result => {
        return User.findById('627b5ae2498197c6cdd07cad')
    })
    .then(user => {
        if (!user) {
            const user = new User({
                name: 'Mohit',
                email: 'aswanim96@gmail.com',
                cart: {
                    items: []
                }
            });
            return user.save();
        }
        return user;
    })
    .then(result => {
        console.log('Connection successful');
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });