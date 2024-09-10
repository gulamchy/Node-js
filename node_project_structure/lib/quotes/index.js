/*
*
* Title: Quotes Library
* Description: Utility library for getting a list of Quotes
* Author: Gulam Sulaman
* Date: 09/08/24
*
*/

// Dependencies
const fs = require('fs');

// Quotes object - Module scaffolding
const quotes = {};

// Get all the quotes and returm them to the user
quotes.allQuotes = function allQuotes(){
    // Read the text file containing the quotes
    const fileContents = fs.readFileSync(`${__dirname}/quotes.txt`, 'utf8');

    // Turn the string into an array
    const arrayOfQuotes = fileContents.split(/\r?\n/);

    // Return the array
    return arrayOfQuotes;
};

module.exports = quotes;