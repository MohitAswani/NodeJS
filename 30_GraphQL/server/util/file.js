const path = require('path');
const Crypto = require('crypto');
const fs= require('fs');

const clearImage = filePath => {
    filePath = path.join(__dirname, '../images/', filePath);
    fs.unlink(filePath, err => console.log(err));
};

exports.clearImage=clearImage;
