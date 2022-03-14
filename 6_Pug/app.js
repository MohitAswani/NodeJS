const path=require('path');

const express=require('express');
const bodyParser=require('body-parser');

const adminRoutes=require('./routes/admin');
const shopRoutes=require('./routes/shop');

const app=express();

// to let express know we will be using pug we do that below declaration.

// in the below code we are setting a global configuration value using set in express.

// we use certain keywords to make express behave a certain way.

// here we use view engine keyword which allows us to tell express that for any dynamic template we are trying to render use this engine we're registering here.

// views allows us to tell express where to find these dynamic views.

// the below set cmd will not work all engines but since pug comes with built in support for pug hence we can use it.

app.set('view engine','pug');

// the default setting for views is the main directory and the views folder.

app.set('views','views');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

app.use('/admin',adminRoutes.router);
app.use(shopRoutes);

app.use((req,res,next)=>{
    res.status(404).render('error',{pageTitle:'Page Not found'});
});

app.listen(3000);