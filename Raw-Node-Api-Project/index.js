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

// App object - Module Scaffolding
const app = {};

// Configuration
app.config = {
    port: 3000,
};

// Create Server 
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);

    // Listening on server
    server.listen(app.config.port, () => {
        console.log(`Listening on port ${app.config.port}`);
    })
}

// Handle Request Response
app.handleReqRes = handleReqRes;

// Start the server
app.createServer();