const path=require('path');

const express=require('express');
const bodyParser=require('body-parser'); 

const adminRoutes=require('./routes/admin')  // importing admin routes.
const shopRoutes=require('./routes/shop');   // importing shop routes.

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

app.use(bodyParser.urlencoded({extended:true}));  

// express prevent the user from directly accessing the files. 

// Hence when we link our css file with the html file express cant send it.

// To do that we need to pass the path to the folder which we want to serve statically  so basically a folder which we want to grant read access to.

app.use(express.static(path.join(__dirname,'public')));

// by adding a path to our use function we can make the request return response only for that paths which start with that.

// for example the below request will return response for all request starting with '/add-product'.

// also we need to add it before request handler for '/' as the code run from top to bottom and it will return the response if we write the one for '/' first.

// IF WE ARE SENDING A RESPONSE WE SHOULD NOT CALL next().

/*

WE HAVE WRITTEN THE CODE FOR THESE TWO ROUTES IN ADMIN.JS.

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



*/


// instead of defining the routes here we add the routes in admin.js and just import and add them to the express app.

// also the order matters.

// when we add a path in the below function express will only filter those requests starting with this path. Also all the urls inside adminRoutes will get added with '/admin' path except the html code. 

// hence this mechanism allows us to put a common starting segment for our path which all routes in a given file use to outsource that into this app.js file so that we dont have to repeat it for all the routes in adminRoutes.

app.use('/admin',adminRoutes);

/*

WE HAVE WRITTEN THE CODE FOR THESE TWO ROUTES IN SHOP.JS.

app.use('/',(req,res,next)=>{

    // response.send allows us to send a response and allows us to attach a body which is of type any.

    // and it automatically sets the content-type in headers and we can also set it manually using setHeadders.

    res.send('<h1>Hello can you hear me?</h1>'); 
});

*/

// also if we use get in '/' routes it will do exact matching and will only return the result for '/' and nothing else and then the order of adding the routes wont matter.


app.use(shopRoutes);

// For error 404 we do the following :

// we set a default request handle where we set the status code to 404.

app.use((req,res,next)=>{
    res.status(404).sendFile(path.join(__dirname,'views','error.html'));
});


// const server=http.createServer(app);
// server.listen(3000);

// Instead of writing the above code to create a server we can directly write app.listen to create that server.


app.listen(3000);

