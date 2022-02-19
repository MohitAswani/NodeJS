const http = require('http');
const fs = require('fs');
const { dirname } = require('path');

const server = http.createServer((req, res) => {

    const url = req.url;
    const method = req.method;
    // below will check if the url is string and has that particular value
    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>My first page</title></head>');
        res.write('<body>');
        res.write('<form action="/message" method="POST">');
        // the action in the above form will define the URL this request should be send to when the button is clicked.
        // method will define the request we are sending
        // POST request has to be setup by us. It requests that a web server accept the data enclosed in the body of the request message.

        res.write('<input type="text" name="input">');
        // so this input will be stored in the request that is sent to our server with "input" name.

        res.write('<button type="submit">Send</button>');
        // here we using the default HTML behaviour of submit which sends a new request when a submit button is clicked.

        res.write('</form>');
        res.write('</body>');
        res.write('</html>');
        return res.end();   // to prevent the below code from executing also.
    }

    // in the below we take the data from the POST request and 
    if (url == '/message' && method === 'POST')   // this will only respond to post requests
    {

        // To parse the request data we need to register an event listener on the request. For createServer it does the same for us.

        // To register the event listener we use the on method. And we listener to the data event.

        // A data event is fired whenever a new chunk is ready to be read. And in the on method we also need to add a function which will be executed for every event.

        // the on event listener will keep on executing until all the chunks of the data are read.

        const body = [];  // to read the request body

        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);  // so we add all the chunks in an array of chunks
        });

        // An end event is fired once all the incoming chunks have been parsed.

        req.on('end', () => {

            // to interact with all these chunks we need a buffer and using which we concat all the chunks and convert them to string.

            const parsedBody = Buffer.concat(body).toString();
            

            // then we store the message after = in a variable and push it to our file.
            const message = parsedBody.split('=')[1];

            // fs.writeFile('message.txt','DUMMY');
            fs.writeFileSync('message.txt', message);    // we use this to write to the file
        });  

        res.writeHead(302, { 'Location': '/', });     // here we are writing some data to the headers. Status code '302' is used for redirection and the sent object will write data to the headers.

        return res.end();
    }

    res.setHeader('Content-type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My first page</title></head>');
    res.write('<body><h1> This is from inside the body</h1></body>');
    res.write('</html>');
    res.end();

});

server.listen(3000);