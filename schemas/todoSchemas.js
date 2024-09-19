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
const todoSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    status: {
        type: String,
        enum: ['active', 'inactive'],
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

// Module Export
module.exports = todoSchema;