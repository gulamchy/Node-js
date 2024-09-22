/*
*
* Title: 
* Description: 
* Author: Gulam Sulaman
* Date: 2024-09-18
*
*/

// Dependencies
const mongoose = require('mongoose');

// Schema for TODOs
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
    },
    todos: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Todo"
        }
    ]
});

// Module Export
module.exports = userSchema;