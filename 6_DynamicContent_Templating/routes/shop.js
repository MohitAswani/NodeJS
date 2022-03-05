const path=require('path');

const express = require('express');

const adminData=require('../routes/admin');

const router = express.Router();

const rootDir=require('../util/path');

router.get('/',(req,res,next)=>{
    console.log('shopjs',adminData.products)
    // res.sendFile(path.join(rootDir,'views','shop.html')); // for returning html files.

    // we use the response.render() to render the template using the default templating engine and we dont need to contrust a path since we have defined views to the views folder. And we can just write shop since pug is the default templating engine.
    
    res.render('shop');
});

module.exports=router;