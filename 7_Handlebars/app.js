const path=require('path');

const express=require('express');
const bodyParser=require('body-parser');

// for pug it did it by default but for handlebar we need to import it.
const expressHbs=require('express-handlebars');

const adminRoutes=require('./routes/admin');
const shopRoutes=require('./routes/shop');

const app=express();

// this will register the templating engine which is not built in express. Pug was built in hence did not require registering as engine.

// we give it a name ('handlebars' in this case) which should not clash with the internal naming of already defined engines in engines.

// also expressHbs is a function and it initialises the handlebar engine.

// Handlebars does support layouts but it works a bit differently than it did with pug.

// To use handlebar we need to configure it and to do that we need to pass in some options in the below statement.

// So we can pass in the folder where our layouts live. The default value is layouts folder in views folder.

// We can also set a default layout.

// Also for the default layout we need to set the extenstion name.

app.engine('hbs',
    expressHbs({
        layoutsDir:'views/layouts/',defaultLayout:'main-layout',
        extName:'hbs'}));

// the below code will set the engine to handlebar.

// also we need to create new files for this view engine.

// and all the files will have the extension of the engine name.

app.set('view engine','hbs');

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