const http = require('http');
const routes= require('./routes');

const server = http.createServer(routes.handler);
console.log(routes.some_text);
server.listen(3000);
// to add npm to our package we use npm init

// we can add some command to perform different operations by adding them to scripts in our  package.json file 

// for already defined special commands we can just 'npm cmd' 

// for custom commands we need to run 'npm run cmd'

// to install some third party dependencies we use npm install

// to update the server when we update the code we use nodemon.

// we can either add dependencies for development or for deployement.

// to add just for development in current project we use --save-dev command.

// to add for proper deployment in current project we use --save command.

// to install it globally we use -g

// we can delete the node_modules and add them again when we need it by using 'npm install'. This command installs all the dependencies required for the project (which are stored in package.json).

// package-lock.json files stores the exact version of modules.

// to use the autorestart function of npm we use nodemon app.js instead of node app.js to run script through package.json.


