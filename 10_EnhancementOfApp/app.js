const path=require('path');

const express=require('express');
const bodyParser=require('body-parser');

const errorController=require('./controllers/error');

const adminRoutes=require('./routes/admin');
const shopRoutes=require('./routes/shop');

const app=express();

// Ejs is another templating engine supported out of the box and we don't need to register the engine like we did with handlebars.

// Ejs is a nice combination of providing the option to write logical code in our templating file and still using normal html code.

app.set('view engine','ejs');

app.set('views','views');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

app.use('/admin',adminRoutes);
app.use(shopRoutes);

app.use(errorController.getError);

app.listen(3000);