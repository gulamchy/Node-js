/*
*
* Title: Routes
* Description: Application Routes
* Author: Gulam Sulaman
* Date: 2024-09-09
*
*/
// Dependencies
const {sampleHandler} = require('./handlers/routeHandlers/sampleHandler');


const routes = {
    'sample':  sampleHandler,
}

module.exports = routes;