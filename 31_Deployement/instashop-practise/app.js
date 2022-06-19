const path = require('path');
const crypto = require('crypto');

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csurf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const User = require('./models/user');

const errorController = require('./controllers/error');

const { fileStorage,getFileStream } = require('./util/s3');

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

const fileFilter = (req, file, cb) => {

    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));

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

app.get('/image/:key', (req,res,next)=>{
    const key=req.params.key;
    const readStream = getFileStream(key);

    readStream.pipe(res);
});

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }

    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            next(new Error(err));
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

app.get('/500', errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {

    console.log(error);

    if (error.httpStatusCode === 404) {
        return res.status(404).render('404', { pageTitle: 'Page Not found', path: {} });
    }

    res.status(500).render('500', {
        pageTitle: 'Server errror',
        path: '/500',
        isAuth: req.session.isAuth
    });
});

mongoose.connect(MONGODB_URI)
    .then(result => {
        console.log('Connection successful');
        app.listen(process.env.PORT);
    })
    .catch(err => {
        console.log(err);
    });