/*
*
* Title: Not-Found Handler
* Description: 404 not found Handler
* Author: Gulam Sulaman
* Date: 2024-09-09
*
*/

// Module Scaffolding
const handler = {}

// Function
handler.notFoundHandler = (requestProperties, callBack) => {
    callBack(404, {
        message: 'Your requested URL was not found!',
    });
}

// Exporting
module.exports = handler;