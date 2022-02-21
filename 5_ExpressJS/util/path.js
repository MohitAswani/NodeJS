const path=require('path');

// we use this utility class to get file paths.

// module.exports=path.dirname(process.mainModule.filename); mainModule has been deprecated

// require.main.filename will refer to the main module that started our application basically to the module which has app.js. 

// So it gives us the path to the file that is responsible for the fact that our application is running. 

// And we put that file name into dirname function to get a path to that directory.

module.exports=path.dirname(require.main.filename); 