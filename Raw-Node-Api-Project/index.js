/*
*
* Title: Uptime Monitoring Application
* Description: A RESTful API to monitor up or down time of user defined links
* Author: Gulam Sulaman
* Date: 09/09/2024
*
*/

// Dependencies
const http               = require('http');
const {handleReqRes}     = require('./helpers/handleReqRes');  
const environment        = require('./helpers/environments');
const data               = require('./lib/data');

// App object - Module Scaffolding
const app = {};

// Configuration
app.config = {};

// Test File System
// data.create('test','newFile', {'name': 'Bangladesh', 'Language': 'Bangla'}, (createError) => {
//     console.log(`error was`, createError);
// });
// data.read('test','newFile', (readError, data) => {
//     console.log(readError, data);
// });

// data.update('test','newFile', {'name': 'India', 'Language': 'Hindi'}, (updateError) => {
//     console.log(`error was`, updateError);
// });
// data.delete('test','newFile',(deleteError) => {
//     console.log(`error was`, deleteError);
// });



// Create Server 
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);

    // Listening on server
    server.listen(environment.port, () => {
        console.log(`Listening on port ${environment.port}`);
    })
}

// Handle Request Response
app.handleReqRes = handleReqRes;

// Start the server
app.createServer();