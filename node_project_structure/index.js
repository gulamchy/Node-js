/*
*
* Title: Basic Node App Example
* Description: Simple node application that print random quotes per second interval.
* Author: Gulam Sulaman
* Date: 09/08/24
*
*/

// Dependencies
const mathLibrary = require('./lib/math'); // This is js file, we don't need to declare the extension cause by default node expect it as a js file
const quotesLibrary = require('./lib/quotes'); // When we access any folder, index.js will be accessed without naming the folder/index.js. We don't need to declare it explicityly. 

// App object - Module scaffolding (skeleton of a modole)
const app = {};

// Configuration 
app.config = {
    timeBetweenQuotes: 1000,
};

// Function that prints a random quotes
app.printAQuote = function printAQuote() {
    // Get all the quotes
    const allQuotes = quotesLibrary.allQuotes();

    // Get the length of quotes
    const numberOfQuotes = allQuotes.length;

    // Pick a random number between 1 and the number of quotes
    const randomNumber = mathLibrary.getRandomNumber(1, numberOfQuotes);

    // Get the quote at that position in the array (minus one)
    const selectQuote = allQuotes[randomNumber -1];

    // Print the quote to the console
    console.log(selectQuote);
};

// Functionthat loops indefinitely, call the printQuote function as it goes
app.indefiniteLoop = function indefiniteLoop(){
    // Create the interval, using the config varaiable defined above
    setInterval (app.printAQuote, app.config.timeBetweenQuotes);
}

// Invoke the loop
app.indefiniteLoop();