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

// To configure the storage of a file we can setup configure a storage object.

// We use the diskStorage function provided by multer , which is a storage engine which we can use with multer and here we can pass in a js object to configure it.

// It takes two keys, it takes the destination and it takes the file name.

// And these are two function which multer will call for incoming files and these function then control how that file is handled regarding the place where we store it and regarding the name.

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // the destination function takes in req,file and a callback which we have to call once we are done setting up that destination,

        // error is null and destination is the name of the destination.
        cb(null, 'images');
    },
    filename: (req, file, cb) => {

        // But since we are defining our own filename function multer will not create a random hash.

        // cb(null,file.filename+'-'+file.originalname);

        // so we use crypto generate a random hash.

        crypto.randomBytes(16, (err, buf) => {
            if (err) {
                console.log(err);
            }
            else {
                cb(null, buf.toString('hex') + '-' + file.originalname);
            }
        });
    }
});

const fileFilter = (req, file, cb) => {   // function to filter the files

    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);   // accept the file
    }
    else {
        cb(null, false);  // reject the file 
    }
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// this is the name input html tag where we upload our file.

// we can pass in some options to multer and one of the option is the dest option.

// This dest option will tell multer to turn the buffer back into binary data and store it in the path we mention.

// But that file as of yet has random hash name,does not have a file extention and is not recognized as an image.

// But if we add png to its name we can see it as an image so we need to store it in a specific way.

// Then we inform multer we want to use the defined storage engine.

// So now we store the file and now we should validate our files.

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

// we now server the images folder too.

// we need to add '/images' to the below static path as express assumes that the files in the images folder are served as if they were in the root folder.

// So we tell express that if we have a request that goes to '/images' then serve these files statically.

app.use('/images',express.static(path.join(__dirname, 'images')));  

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
    res.status(500).render('500', {
        pageTitle: 'Server errror',
        path: '/500',
        isAuth: req.session.isAuth
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