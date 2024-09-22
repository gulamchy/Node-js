/*
*
* Title: TODO API Routes
* Description: API routes for managing TODOs with CRUD functionality
* Author: Gulam Sulaman
* Date: 2024-09-18
*
*/

// Dependencies
const express = require("express");
const mongoose = require("mongoose")
const todoSchema = require("../schemas/todoSchemas");
const userSchema = require("../schemas/userSchema");
const checkLogin    = require("../middlewares/checkLogin");

// Using express Router 
const router = express.Router();

// Construction Model from Schema - Todo is class and it's name should be singler not plural
const Todo = new mongoose.model("Todo", todoSchema);
const User = new mongoose.model("User", userSchema);


// Get all the TODOs
router.get('/', checkLogin, async(req, res) => {
    try {
        const todos = await Todo.find()
        .populate("user", "name username -_id")
        .select({
            _id: 0,
            __v: 0,
            date: 0
        }).limit(2);
        console.log(todos);
        res.status(200).json({Message: "Fetched all the todos successfully"});
    } catch(err) {
        res.status(400).json(`Error: Error fetching TODO, ${err} `);
    }
});

// Find all todo using method instance
router.get("/active", async (req, res) => {
    const todo = new Todo();
    const data = await todo.findActive();
    res.status(200).json({
        data: data,
    });
});

// Statics Instance
router.get('/js', async (req, res) => {
    const data = await Todo.findByJS();
    res.status(200).json({
        data: data,
    });
});

// Query Helper
router.get('/lang', async (req, res) => {
    const data = await Todo.find().byLanguage("react");
    res.status(200).json({
        data: data,
    });

});

// Get a the TODO by ID
router.get('/:id', async(req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if(todo) {
            res.status(201).json({Message: "Fetched todo successfully"});
        } else {
            res.status(400).json({ Message: "TODO not found "});
        }
    } catch (error) {
        res.status(400).json(`Error: Error fetching TODO, ${err} `);
    }
});

// Post single the TODO
router.post('/', checkLogin, async(req, res) => {
    try{
        const newTodo = new Todo({
            ...req.body,
            user: req.userId,
        });
        const saveTodo = await newTodo.save();
        await User.updateOne({
            _id: req.userId
        }, {
            $push: {
                todos: saveTodo.id,
            }
        });
        res.status(201).json(`${saveTodo.title} - successfully inserted!`);
    } catch(err){
        res.status(400).json(`Error: Error inserting TODO, ${err} `);
    }
});


// Post Multiple the TODO
router.post('/all', async(req, res) => {
    try{
        const todos = await Todo.insertMany(req.body);
        res.status(201).json({Message: "Successfully Inserted all  Todos!"});
    } catch(err) {
        res.status(400).json({Error: "There was a problem inserting the todos!"});
    }
});

// Put single the TODO
router.put('/:id', async(req, res) => {
    try{
        const updateTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(updateTodo) {
            res.status(201).json({
                Message: "Successfully Updated!",
            });
        } else {
            res.status(404).json({ Message: "TODO not found" });
        }
    } catch(err) {
        res.status(400).json({Error: "There was a problem updating the todos!"});
    }
    
});

// Delete single the TODO
router.delete('/:id', async(req, res) => {
    try{
        const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
        if(deletedTodo){
            res.status(201).json({Message: "Deleted Successfully!"});
        } else {
            res.status(404).json({Error: "Todo was not found!"});
        }
    } catch(err) {
        res.status(400).json({Error: "There was a problem deleting the todo!"})
    }
});

// Module Export
module.exports = router;



