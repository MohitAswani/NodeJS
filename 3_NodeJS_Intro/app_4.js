const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {

    const url = req.url;
    const method = req.method;
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

            // For writing to a file there are two functions : 1) writeFile 2) writeFileSync

            // The first function is an async function and will perform the action without blocking the code

            // The latter function is a sync function and will block the execution of the rest of the code.

            // So whenever we are writing or reading a large file writeFileSync will make the site irresponsive for the time being. So its always better to use writeFile.

            // Also writeFile function takes in a callback which will be called when the function is done. And it also takes in an argument error which can be used to show the error which has occured.

            
            // fs.writeFileSync('message.txt', message);

            fs.writeFile('message.txt', message, (error) => {
                // in the callback we add the below code as we need to return the request only after we have written the file.
                // in the background everything will happen using multi-threading and without blocking the code execution.
                console.log(error);
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
});

server.listen(3000);