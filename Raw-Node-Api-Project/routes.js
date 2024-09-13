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
const {userHandler} = require('./handlers/routeHandlers/userHandler');
const {tokenHandler} = require('./handlers/routeHandlers/tokenHandler');


const routes = {
    sample:  sampleHandler,
    user: userHandler,
    token: tokenHandler,
}

module.exports = routes;