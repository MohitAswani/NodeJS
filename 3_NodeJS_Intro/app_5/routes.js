const fs=require('fs');

const requestHandler=(req,res)=>{

    const url=req.url;
    const method=req.method;

    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>My first page</title></head>');
        res.write('<body>');
        res.write('<form action="/message" method="POST">');
        res.write('<input type="text" name="input">');
        res.write('<button type="submit">Send</button>');
        res.write('</form>');
        res.write('</body>');
        res.write('</html>');
        return res.end();
    }
    if (url == '/message' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);
        });
        return req.on('end', () => {
            const parshedBody = Buffer.concat(body).toString();
            const message = parshedBody.split('=')[1];
            fs.writeFileSync('message.txt', message, (error) => {
                res.writeHead(302, { 'Location': '/', });
                return res.end();
            });
        });
    }
    res.setHeader('Content-type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My first page</title></head>');
    res.write('<body><h1> This is from inside the body</h1></body>');
    res.write('</html>');
    res.end();

};

// module is a global object exposed by node and we use it to export our requestHandler function.

// Here we are registering the function and we can register anything here to export it.

// For mutliple exports we can use a object.

module.exports={
    handler: requestHandler,
    someText: 'Test text'
};

// Exports can also be added like the following : 

// module.exports.handle=requestHandler;
// module.exports.someText='Test text';

// exports.handle=requestHandler;
// exports.someText='Test text';

// module.exports=requestHandler;