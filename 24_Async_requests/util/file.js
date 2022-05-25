const fs = require('fs');

const deleteFile = (filePath) => {

    // This function will delete the file related with this filePath

    fs.unlink(filePath, (err) => {
        if (err) {

            // we throw the error and it will bubble up later and will be handled by our default error handler.

            throw (err);
        }
    })
}

exports.deleteFile=deleteFile;