/*
*
* Title: TODO API Routes
* Description: API routes for managing TODOs with CRUD functionality
* Author: Gulam Sulaman
* Date: 2024-09-18
*
*/

// Dependencies
const express       = require("express");
const mongoose      = require("mongoose");
const bcrypt        = require("bcrypt");
const dotenv        = require("dotenv");
const jwt           = require("jsonwebtoken");
const userSchema    = require("../schemas/userSchema");

// Using express Router 
const router        = express.Router();
dotenv.config()

// Construction Model from Schema - Todo is class and it's name should be singler not plural
const User          = new mongoose.model("User", userSchema);


// Signup
router.post('/signup', async(req, res) => {
    try{
        const hashPassword      = await bcrypt.hash(req.body.password, 10);
        const newUser       = new User({
            name: req.body.name,
            username: req.body.username,
            password: hashPassword,
        });
        const saveUser      = await newUser.save();
        res.status(201).json(`${saveUser.name} - successfully created!`);

    } catch(err){
        res.status(400).json(`Error: Error creating User, ${err} `);
    }
    
});

// Login
router.post('/login', async(req, res) => {
    try {
        const user = await User.find({username: req.body.username});
        if(user && user.length > 0){
            const isValidPassword   = await bcrypt.compare(req.body.password, user[0].password);
            if(isValidPassword){
                const token = jwt.sign({
                    username: user[0].username,
                    userId: user[0]._id,
                }, process.env.JWT_SECRET, {
                    expiresIn: '1h',
                });

                res.status(200).json({
                    "access_token": token,
                    "message": "Login Successful!"
                });
            } else{
                res.status(401).json({'Error':'Authentication Failed!'});
            }

        } else {
            res.status(401).json({'Error':'Authentication Failed!'});
        }
    } catch(err){
        res.status(500).json({ 'Error': 'Something went wrong!' });
    }
});


// Get all users with todos
router.get('/all', async (req, res) =>{
    try{
        const users = await User.find().populate("todos");
        if(users){
            res.status(200).json({data: users, Message: "Fetching Successful!"});
        } else {
            res.status(500).json({error: "There was a server side error!"});
        }

    } catch(err){
        res.status(500).json({error: "There was a server side error!"});
    }
});
// Module Export
module.exports = router;



