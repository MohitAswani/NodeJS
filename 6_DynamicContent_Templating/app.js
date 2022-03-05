const path=require('path');

const express=require('express');
const bodyParser=require('body-parser'); 

const adminData=require('./routes/admin')  // importing admin routes.
const shopRoutes=require('./routes/shop');   // importing shop routes.

const app=express();  

app.use(bodyParser.urlencoded({extended:true}));

// to let express know we are using pug we use app.set()

// app.set() allows us to set any values globally on our express application and this can be keys or configuration items express doesn't understand but we can read from express app and this is another way of sharing data accross our application.

// But here we use some reserved key words which change the configurations and lead to express behaving differently : 1) views 2) view engine.

// View engine allows us to tell express that for any dynamic templates we're trying to render please use the engine which we are registering.

// Views allows us to tell express where to find these dynamic views.

// we set view engine to pug which is already supported by express and will auto register itself with express.

app.set('view engine','pug');

// we set views to directly to find the dynamic views and the default directory is '/views' in the current cmd running directory.

app.set('views','views');  

app.use(express.static(path.join(__dirname,'public')));

app.use('/admin',adminData.router);

app.use(shopRoutes);

app.use((req,res,next)=>{
    res.status(404).sendFile(path.join(__dirname,'views','error.html'));
});

app.listen(3000);


// we install all the three main templating engines and we install them as save because they are a core part of our project.

// we run : npm install --save ejs pug express-handlebars. 

// we use express-handlebar since it already has compatability with express.
