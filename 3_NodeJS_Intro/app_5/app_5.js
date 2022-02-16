const http = require('http');

// We can write the code for routing in a seperate file.

// To do this we create a seperate function and store the logic there.

// Then we export the function to this file.

// When we require this node will go and look for a file named routes in the same directory. And in that file it will look for module exports and see what is registered in there. And the routes const will hold the handler.

const routes=require('./routes');

// One more thing about node is that the contents of routes will be catched by node and cannot be edited externally.

const server = http.createServer(routes.handler); // this will tell node to use module.exports function in routes to handle the requests.

console.log(routes.someText);

server.listen(3000);


