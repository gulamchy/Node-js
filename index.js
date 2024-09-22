/*
*
* Title: 
* Description: 
* Author: Gulam Sulaman
* Date: 2024-09-18
*
*/

// Dependencies
const express = require("express");
const mongoose = require("mongoose");
const todoHandler = require("./routeHandler/todoHandler");
const userHandler = require("./routeHandler/userHandler");

// Database Connection
mongoose.connect("mongodb://localhost/todos")
    .then(() => console.log("Connection successful!"))
    .catch((error) => console.log(error));

// Express app initialization
const app = express();
app.use(express.json());

// Application Routes
app.use("/todo", todoHandler);
app.use("/user", userHandler);

// Default error Handler
const errorHandler = (err, req, res, next) => {
    if(res.headersSent) {
        next(err)
    }
    res.status(500).json({error: err});
};

app.use(errorHandler);
// Listening to Server
app.listen(3000, () => {
    console.log("Listening to port 3000...");
});
