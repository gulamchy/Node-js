/*
*
* Title: Sample Handler
* Description: Sample Handler
* Author: Gulam Sulaman
* Date: 2024-09-09
*
*/

// Module Scaffolding
const handler = {}

// Function
handler.sampleHandler = (requestProperties, callBack) => {
    console.log(requestProperties);
    callBack(200, {
        message: 'This is a sample URL!',
    });
}

// Exporting
module.exports = handler;