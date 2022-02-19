
const http=require('http')

const express=require('express');
const body_parser=require('body-parser');

const app=express();

app.use(body_parser.urlencoded());


app.post('/test',(res,req,next)=>{

});

app.use('/',(res,req,next)=>{

});


app.listen(3000);