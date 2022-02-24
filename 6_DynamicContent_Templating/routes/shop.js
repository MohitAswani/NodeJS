const path=require('path');

const express = require('express');

const adminData=require('../routes/admin');

const router = express.Router();

const rootDir=require('../util/path');

router.get('/',(req,res,next)=>{
    console.log('shopjs',adminData.products)
    res.sendFile(path.join(rootDir,'views','shop.html'));
});

module.exports=router;