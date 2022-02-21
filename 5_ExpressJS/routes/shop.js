const path=require('path');
const express = require('express');

const router = express.Router();

const rootDir=require('../util/path');

router.get('/',(req,res,next)=>{
    
    // to construct the path we use the path module.

    // and we use path.join to create the path. Join yields us a path at the end, it returns a path but it constructs this path by concatenating the different segment.

    // the first segment __dirname is a global variable made available by node js called directory name.

    // then we move one step out of this directory and go to views folder and then to shop.html.

    // we also use this not deal with different file systems in unix and x86.

    // res.sendFile(path.join(__dirname,'..','views','shop.html'));

    res.sendFile(path.join(rootDir,'views','shop.html'));
});

module.exports=router;