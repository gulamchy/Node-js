const fs = require('fs');



const ourReadStream = fs.createReadStream('bigData.txt');

ourReadStream.on('data', (chunk) => {
    console.log('Hello\n');
    console.log(chunk.toString());
});