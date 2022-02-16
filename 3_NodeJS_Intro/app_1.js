// we import https module to use it

const http = require('http');  // require is used to import files in nodejs and it either takes a path or name of a core module. And we can also import one of our own file using require(). The path to our modules start with './file'

// const http = require('./test') this is to import a local file named test

// createServer takes a function called requestListener which will be executed for every request we make.

// the request listener takes in two arguments. The request and the response.

// function rqListener(req,res){  

// };

// http.createServer(rqListener);  

// http.createServer(function(req,res){

// });  // another way of adding request listener

// the createServer method returns the server

const server=http.createServer((req,res)=>{

    // in the below console we make a request for url but url is what is after the localhost and if its empty url is '/'
    // since we have not written any method hence it is GET by default
    // and headers contain the information about the metadata
    console.log(req.url,req.method,req.headers); 



    // This will add a header named Content-Type to the meta data and the value at the header will be test/html.
    res.setHeader('Content-Type','text/html');


    
    // This will allow us to write data to the response in chunks or mutliple lines.
    res.write('<html>');
    res.write('<head><title>My first page</title></head>');
    res.write('<body><h1> This is from inside the body</h1></body>');
    res.write('</html>');
    res.end();  // this will tell node that this is the end of our request write
    // res.write(); // this will give error
    
    // we can also see this response from the network tag of inspect




    // the below cmd will stop the event loop when we make any request from this server.
    // process.exit();  // a method to end the event loop.

});  // creating request using arrow function.

// the below function will keep the server running for listening to incoming requests.

// to this function we need to pass a port (3000 in this case) and a hostname which by default is the name of the machine.
server.listen(3000);