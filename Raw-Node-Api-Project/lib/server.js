/*
*
* Title: Server Library
* Description: Server Related Files
* Author: Gulam Sulaman
* Date: 09/16/2024
*
*/

// Dependencies
const http               = require('http');
const {handleReqRes}     = require('../helpers/handleReqRes');  
const environment        = require('../helpers/environments');
const data               = require('./data');
const { sendTwilioSms }  = require('../helpers/notificaton');

// Server object - Module Scaffolding
const server = {};

// Configuration
server.config = {};

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

// sendTwilioSms('+18777804236', 'My Name is Gulam', (error) => {
//     console.log(`${error}`);
// });



// Create Server 
server.createServer = () => {
    const serverVariable = http.createServer(server.handleReqRes);

    // Listening on server
    serverVariable.listen(environment.port, () => {
        console.log(`Listening on port ${environment.port}`);
    })
}

// Handle Request Response
server.handleReqRes = handleReqRes;

// Start the server
server.init = () => {
    server.createServer();
};

// Export the module
module.exports = server;