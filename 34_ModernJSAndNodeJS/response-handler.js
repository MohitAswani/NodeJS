// const fs = require('fs');

// const fs = require('fs').promises;

// To use promise in fs we add /promises.
import fs from "fs/promises";
import path, { dirname } from "path"; // imports the entire path module
import { fileURLToPath } from "url";
// import { dirname } from "path";  // also has named imports

// import.meta.url is globally available filename which gives us the path to the file name and the function fileUrlToPath just converts that url to a path with which the path with which the path package is then able to work.
const __filename = fileURLToPath(import.meta.url);

// And the dirname function provided by path package just takes such a path to the current file to give us the path to the current folder.
const __dirname = dirname(__filename);

export const resHandler = (req, res, next) => {
  // readFile now returns a promise
  fs.readFile("my-page.html", "utf8")
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });

  // res.sendFile('my-page.html');  // will not work and we need an absolute path.

  // modern es module syntax has no globals
  // res.sendFile(path.join(__dirname, "my-page.html")); // will give __dirname not defined.
};

// module.exports=resHandler;

// but if we have multiple exports we can't use this since it is only usable once a file.

// We can also export multiple things by adding export right into line where we define our function.

// export default resHandler; // we add this or else the export wont work.
