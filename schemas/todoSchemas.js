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
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    }
});

// Instance Mthods
todoSchema.methods = {
    findActive: function() {
        return mongoose.model("Todo").find({status: "active"});
    }
};

// Static Methods
todoSchema.statics = {
    findByJS: function() {
        return this.find({title: /js/i});
    },
};

// Query Helpers
todoSchema.query = {
    byLanguage: function(language) {
        return this.find({title: new RegExp(language, "i")});
    }
};

// Module Export
module.exports = todoSchema;