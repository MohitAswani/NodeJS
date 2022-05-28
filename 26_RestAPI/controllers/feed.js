exports.getPosts=(req,res,next)=>{

    // Used to send json response to the client

    // We can simply pass in a JS object and it will convert it to json object and return it to the client.

    // We also need to send status codes with api responses so that in the client we have a easier way of handling it.Since the client has to render views based on the data so he needs error codes.

    res.status(200).json({
        posts:[
            {
                title:'First post',
                content:'This is the first post!',
            }
        ]
    });
};

// We use POST method here to add post since there can be many posts.

// If we wanted to write a method to edit user data we could have used PUT so as to overwrite the data.

exports.postPost=(req,res,next)=>{
    console.log(req.body);
    const title = req.body.title;
    const content = req.body.content;

    // Create post in db

    // We use http code 201 when we want to tell the client that a resource was created successfully.

    // JSON is the type of data we use for request and responses.

    res.status(201).json({
        message:'Post created successfully!',
        post:{
            id: new Date().toISOString,
            title:title,
            content:content
        }
    });
};