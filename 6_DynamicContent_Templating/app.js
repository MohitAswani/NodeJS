const path=require('path');

const express=require('express');
const bodyParser=require('body-parser'); 

const adminData=require('./routes/admin')  // importing admin routes.
const shopRoutes=require('./routes/shop');   // importing shop routes.

const app=express();  

app.use(bodyParser.urlencoded({extended:true}));  

app.use(express.static(path.join(__dirname,'public')));

app.use('/admin',adminData.router);

app.use(shopRoutes);

app.use((req,res,next)=>{
    res.status(404).sendFile(path.join(__dirname,'views','error.html'));
});

app.listen(3000);

