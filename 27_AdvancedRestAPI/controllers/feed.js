exports.getPosts=(req,res,next)=>{
    res.status(200).json({
        posts:[
            {
                title:'First post',
                content:'This is the first post!',
            }
        ]
    });
};

exports.postPost=(req,res,next)=>{
    console.log(req.body);
    const title = req.body.title;
    const content = req.body.content;

    res.status(201).json({
        message:'Post created successfully!',
        post:{
            id: new Date().toISOString,
            title:title,
            content:content
        }
    });
};