const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const User = require('./models/user');

const errorController = require('./controllers/error');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const MONGODB_URI = 'mongodb+srv://aswanim96:Mohit1234@cluster0.o2of3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const app = express();

// To the store we pass in some options which tell it how and where to store our sessions.

// uri : is the connections uri.

// collection : is the name of the connection where it need to store the sessions.

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());    // used to parse cookies easily

// secret will be used to sign the hash which secretly stores our ID in the cookie.

// resave : false means that the session will not be saved on every request that is done but only if something changed in the session.

// saveUninitialized : will make sure that no session get saved for a request where it doesn't need to be saved 

// cookie : will be the cookie which will store our session id.

// store : will be the store which will store our sessions.

// We also configure the session cookie in here .

app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httponly: true,
        store: store
    },
    store: store
}));

app.set('view engine', 'ejs');

app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    if(req.session.user){

        User.findById(req.session.user._id)
            .then(user => {
                req.user=user;
                next();
            })
            .catch(err=>{
                console.log(err);
            });
    }
    else{
        next();
    }
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.getError);

mongoose.connect(MONGODB_URI)
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