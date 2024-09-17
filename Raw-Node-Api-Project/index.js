/*
*
* Title: Uptime Monitoring Application
* Description: A RESTful API to monitor up or down time of user defined links
* Author: Gulam Sulaman
* Date: 09/09/2024
*
*/

// Dependencies
const servers = require('./lib/server');
const workers = require('./lib/worker');
const {sendTwilioSms} = require('../Raw-Node-Api-Project/helpers/notificaton');

// App object - Module Scaffolding
const app = {};

// Function Initialization
app.init = () => {
    // Start the server
    servers.init();

    // Start the workers
    workers.init();
}

// Handle Request Response
app.init();

// sendTwilioSms('18777804236', 'My Name is Gulam', (error) => {
//     console.log(`${error}`);
// });

// Export the module ( not neccessary but good practice )
module.exports = app;