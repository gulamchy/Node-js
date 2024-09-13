/*
*
* Title: Utilities
* Description: Handle all utilities related things
* Author: Gulam Sulaman
* Date: 2024-09-11
*
*/

// Dependencies
const crypto        = require('crypto');
const environment   = require('./environments');


// Module Scaffolding
const utilities = {};

// Parse JSON string to object
utilities.parseJSON = (jsonString) => {
    let output;

    try{
        output = JSON.parse(jsonString);
    } catch{
        output = {};
    }

    return output;
};

// Password hashing
utilities.hash = (str) => { 
    if(typeof(str) === 'string' && str.length > 0) {
        const hash = crypto
            .createHmac('sha256', environment.secretKey)
            .update(str)
            .digest('hex');
        return hash;
    }
    else {
        return false;
    }
};

// Generating Random Strings
utilities.createRandomString = (strLength) => { 
    let stringLength = strLength;
    stringLength = typeof strLength === 'number' && strLength > 0? strLength : false;

    if(stringLength){
        const possibleChar = 'abcdefghijklmnopqrstuvwxyz1234567890';
        let output = '';
        for( let i = 1; i <= stringLength; i += 1){
            const randomChar = possibleChar.charAt(
                Math.floor(Math.random() * possibleChar.length)
            );
            output += randomChar;
        }
        return output;
    }
    return false;
};



// Export Module
module.exports = utilities;


