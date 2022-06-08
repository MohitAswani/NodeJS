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


mongoose
    .connect(process.env.MONGO_DB_CONNECTION_URI)
    .then(result => {
        const server=app.listen(8080); 

        const io = require('./socket').init(server,{
            cors:{
                origin:'*',
            }
        });

        io.on('connection',socket=>{
            console.log(socket.id);
            console.log('Client connected');
        });

    })
    .catch(err => {
        console.log(err);
    })
