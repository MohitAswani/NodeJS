const http = require('http');
const routes= require('./1_route');

const server = http.createServer(routes.handler);

server.listen(3000);