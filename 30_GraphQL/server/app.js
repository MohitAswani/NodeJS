const path = require('path');
const Crypto = require('crypto');

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { graphqlHTTP } = require('express-graphql');

const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');


const app = express();

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

// Adding graphql request handlers.

// We apply this to /graphql , and we can change it.

// We dont limit this to post request.

// We use the graphqlHttp function and we pass in a js object to configure it.

// And it needs two items to work: 1) schema , 2) rootValue(points to our resolver).

/* 

Following is an example of a graphQL query : 
    {
        "query":"{ hello { text views } }"
    }

This will fetch us only the required data and will do the filtering on the server itself.

*/

// To test our graphql apis we can set the graphiql options in the graphqlHTTP as true.

// This gives us a special tool and that is the reason we are not only listening to post requests.

// To test we must add a query even if we dont add the implementation

app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql:true
}));

app.use((error, req, res, next) => {

    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message: message,
        data: data
    })
})


mongoose
    .connect(process.env.MONGO_DB_CONNECTION_URI)
    .then(result => {
        app.listen(8080);
    })
    .catch(err => {
        console.log(err);
    })
