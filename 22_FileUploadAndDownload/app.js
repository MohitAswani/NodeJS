const path = require('path');

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csurf = require('csurf');
const flash = require('connect-flash');

const User = require('./models/user');

const errorController = require('./controllers/error');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const MONGODB_URI = process.env.MONGODB_URI;

const app = express();

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
});

const csrfprotection = csurf({});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httponly: true,
        store: store
    },
    store: store
}));

app.use(csrfprotection);

app.use(flash());

app.set('view engine', 'ejs');

app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    // Outside of async code we just throw the error and express will use the error handling middleware using next(error).

    // Inside of async code we need to use the next(error) function to handle the error.

    // throw new Error('Sync error');   

    if(!req.session.user){       // for the case when session doesn't exist.
        return next();           // we need to return next so that the rest of the function is not executed.
    }

    User.findById(req.session.user._id)
        .then(user => {
            throw new Error('Dummy');
            if (!user) {         // for the case when user doesn't exist.
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            next(new Error(err));    
            
            // when we do have a error we throw it and express js has a special way of taking care of such errors.

            // Throwing an error will not lead to express error middleware.
        });

});

app.use((req, res, next) => {
    res.locals.isAuth = req.session.isAuth;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500',errorController.get500);

app.use(errorController.get404);   // catch all middleware to catch unknown requests.

// Special middleware which will be called when error passed in to next.

// Below is a special middleware which will handle errors and it takes in 4 argument will error as one of the arguments.

// If we have more than one error handling middleware then will execute from top to bottom just like normal middleware.

app.use((error,req,res,next)=>{

    // We can use the extra info provided by the error object to make a better sense of the error.

    // res.status(error.httpStatusCode).render();

    // Since we want error handling app.js as well so we can't just redirect to /500 since that will lead to an infinite loop of error, hence we must render the page here itself.

    res.status(500).render('500', { 
        pageTitle: 'Server errror', 
        path: '/500',
        isAuth:req.session.isAuth
    });
});                         

mongoose.connect(MONGODB_URI)
    .then(result => {
        console.log('Connection successful');
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });