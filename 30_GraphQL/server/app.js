const path = require('path');
const Crypto = require('crypto');

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');

const app = express();

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/');
    },
    filename: (req, file, cb) => {
        Crypto.randomBytes(16, (err, buff) => {
            if (err) {
                err.statusCode = 500;
                throw err;
            }

            const filename = buff.toString('hex') + '-' + file.originalname;
            cb(null, filename);
        })
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}

app.use(express.json());
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');

    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

    next();
})

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {

    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message: message,
        data:data
    })
})

// we can directly add the name of the database to the connection uri.
mongoose
    .connect(process.env.MONGO_DB_CONNECTION_URI)
    .then(result => {
        const server=app.listen(8080);  // listen function returns a server

        // We setup our socket io connections similar to the routes and since both use a different protocol they wont interfere with each other.

        // This package exposes a function which requires our created server as an argument.

        // And websockets are built up on HTTP and since our sever uses HTTP we use that server to setup our websocket connection.

        // const io = require('socket.io')(server,{
        //     cors:{
        //         origin:'*',
        //     }
        // });
        
        // We can use the io to define a couple of event listeners.

        // Below is an event when a new client connects to us. The function get the connection/socket which connected to us.

        // To connect the client we need to add it to our frontend.

        // So now we are using the socket.js file to init the socket.We do to so to allow other files to access the io object too.

        const io = require('./socket').init(server,{
            cors:{
                origin:'*',
            }
        });

        io.on('connection',socket=>{
            console.log(socket.id);
            console.log('Client connected');
        });

        // To be able to reuse the same IO object that manages the same connection we create a new file.
    })
    .catch(err => {
        console.log(err);
    })
