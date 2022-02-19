const http=require('http');

const express=require('express');
const bodyParser=require('body-parser'); 

const app=express();  // this will instialize an object which is used to create an express application.

// Also the app will be a valid request handler.

// use allows us to add middleware function. It accepts an array of request handlers . And all the functions must take three arguments that are request, response and next.

// req and res are same with some extra features. 

// next is actually a function which will be passed to the function inside use by express js. Next has to be executed to allow the request to travel to the next middleware.

/*

app.use((req,res,next)=>{
    console.log("In the middleware");
    next();  

    // we need to call this function to allow the request to travel on to the next middleware.

    // if we dont call next the response will be sent and no more middleware can be added.

    // express doesnt send a default response and we need to send a response.
});

*/




// the following router is used to parse the incoming data. And we use the body-parser library for it.

// we use the bodyParser.urlencoded to parse the body and in the end this just yield us such a middleware function which will parse the data and call next in the end.

// this function will not parse all kinds of bodies but will parse bodies which are send through the form.

app.use(bodyParser.urlencoded());  





    
app.use('/',(req,res,next)=>{
    next();
});

// by adding a path to our use function we can make the request return response only for that paths which start with that.

// for example the below request will return response for all request starting with '/add-product'.

// also we need to add it before request handler for '/' as the code run from top to bottom and it will return the response if we write the one for '/' first.

// IF WE ARE SENDING A RESPONSE WE SHOULD NOT CALL next().

app.use('/add-product',(req,res,next)=>{

    // response.send allows us to send a response and allows us to attach a body which is of type any.

    // and it automatically sets the content-type in headers and we can also set it manually using setHeadders.

    res.send('<form action="/product" method="POST"><input typ"text" name="title"><button type="submit">Add product</button></form>'); 
});

// We can place it anywhere since product and add-product dont have anything in common.

// to filter out all the GET request and only respond to the POST request we use post instead of use.

// post and get are similiar to use only difference being the type of request they respond to.

app.post('/product',(req,res,next)=>{

    // res.body is a new field added by express.

    // req gives us a body but by default it will not parse the incoming body.And we do that by adding another middleware and we do that before the route handling middleware.

    console.log(req.body);

    // the below function is used to redirect to a particular path.

    res.redirect('/');
    
});

app.use('/',(req,res,next)=>{

    // response.send allows us to send a response and allows us to attach a body which is of type any.

    // and it automatically sets the content-type in headers and we can also set it manually using setHeadders.

    res.send('<h1>Hello can you hear me?</h1>'); 
});

// const server=http.createServer(app);
// server.listen(3000);

// Instead of writing the above code to create a server we can directly write app.listen to create that server.

app.listen(3000);

