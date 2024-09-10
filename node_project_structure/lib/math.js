/*
*
* Title: Math Library
* Description: Utility library for math-related functions
* Author: Gulam Sulaman
* Date: 09/08/24
*
*/

// Math object - Module Scaffolding
const math = {}

// Get a random integer between two integers
// Inspired by or other links here
math.getRandomNumber = function getRandomNumber(min, max) {
    let minimum = min;
    let maximum = max;
    minimum = typeof minimum === 'number' ? minimum : 0;
    maximum = typeof maximum === 'number' ? maximum : 0;
    return Math.floor(Math.random() * (maximum - minimum + 1) + minimum);
};

module.exports = math;