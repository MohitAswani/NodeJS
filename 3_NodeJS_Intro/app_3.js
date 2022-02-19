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
            fs.writeFileSync('message.txt', message);
            res.writeHead(302, { 'Location': '/', });
            return res.end(); 

            // they above line will only execute when the req is completely read. Which is too late as the code moves on executes the below lines giving us error.

            // to solve this issue we must add a return to the event listener.
        });

        // the below code will execute before the above event listener that is because the above event listener will execute only after event occurs.

        // And also even though the response is sent , the event listenerss still remains active.

        // And if we want to manipulate our response based on an event we need to return the response from within that event listener.

        // And we need to understand the pattern of event driven code. It includes passing in the function to a listener which in turn executes that code whenever the listener is triggered and hence that code is executed asynchronously.

        // NodeJs has a registry for all the event listeners and whenever a particular event is triggered it calls that function.

        // Functions which are passed in listeners are called callbacks as they will be called when a particular condition occurs.

        // res.writeHead(302, { 'Location': '/', });
        // return res.end();
    }
    res.setHeader('Content-type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My first page</title></head>');
    res.write('<body><h1> This is from inside the body</h1></body>');
    res.write('</html>');
    res.end();
});

server.listen(3000);