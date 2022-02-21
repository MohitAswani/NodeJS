const path=require('path');

const express=require('express');
const bodyParser=require('body-parser');

const createRoute=require('./routes/create');
const blogsRoute=require('./routes/blogs');

const app=express();

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,'public')));

app.use(createRoute);

app.use(blogsRoute);

app.use((req,res,next)=>{
    res.status(404).sendFile(path.join(__dirname,'views','error.html'));
});

app.listen(3000);
