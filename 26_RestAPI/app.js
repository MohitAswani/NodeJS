const express = require('express');

const app=express();

const feedRoutes=require('./routes/feed');

// app.use(express.urlencoded({extended:true}));  // hold data in the form x-www-form-urlencoded <form> , it is the default body parser for html forms.
app.use(express.json());  // for application/json

// To allow CORS we add the following headers to our response.

app.use((req,res,next)=>{

     // Allow access from all clients , we can also add specific client.
    res.setHeader('Access-Control-Allow-Origin','*'); 

    // We define what we want the client to access
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    
    // We now define the headers our client is allowed to set.
    // We set Content-Type and authorization
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');

    next();
})

app.use('/feed',feedRoutes);

app.listen(8080);