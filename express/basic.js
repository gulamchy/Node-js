/*
*
* Title: Express Introduction
* Description: Basic Express js code
* Author: Gulam Sulaman
* Date: 2024-09-16
*
*/

// Dependencies
const express = require('express');
const cookieparser = require('cookie-parser');
const handle = require('./handle');

// Module Scaffolding
const app = express();

// app.param('id', (req, res, next, id)=> {
//     const user = {
//         userId: id,
//         name: 'Gulam'
//     }
//     req.userDetails = user;
//     next();
// });

// app.get('/user/:id', (req, res) => {
//     res.send(req.userDetails);
//     // res.send('This is home page');
// });

// app.use(express.json());
// app.use(cookieparser());
 
// const adminRouter = express.Router();

// adminRouter.get('/dashboard', (req, res) => {
//     console.log(req.baseUrl);
//     res.send('This is dashboard page');
// });

// app.use('/admin', adminRouter);

// app.get('/user/', (req, res)=>{
//     console.log(req.cookies);
//     res.send('This is user page');
// });

// app.post('/user/', (req, res)=>{
//     console.log(req.body);
//     res.send('This is post page');
// });

// app.set('view engine', 'ejs');

// app.get('/test', (req, res) => {
//     res.send('Hello');
// });

// app.get('/about', (req, res) => {
//     // console.log(res.headersSent);
//     // res.render('pages/about', {
//     //     name: 'Bangladesh',
//     // });
//     // console.log(res.headersSent);
//     // res.json({
//     //     'name': 'Bangladesh',
//     // });
//     // res.format({
//     //     'text/plain': () => {
//     //         res.send('Hi');
//     //     },
//     //     'text/html': () => {
//     //         res.render('pages/about', {
//     //             name: 'Bangladesh'
//     //         });
//     //     },
//     //     'application/json': () => {
//     //         res.json({
//     //             name: 'Bangladesh'
//     //         });
//     //     },
//     //     default: () => {
//     //         res.status(406).send('Not Acceptable');
//     //     },
//     // });
//     // res.cookie('name', 'Gulam cookie', {
//     //     secure: true
//     // });
//     // res.end()
//     res.redirect('/test');
//     res.end();
// });


const logger = (req, res, next) => {
    console.log(`${new Date(Date.now()).toLocaleString()} - ${req.method} - ${ req.protocol} - ${req.originalUrl} - ${req.ip}`);
    throw new Error('There was a sever side error');
};

app.use(logger);

app.get('/about', (req, res) => {
    res.send('About');
});

const errorMiddleWare = (err, req, res, next) => {
    console.log(err.message);
    res.status(500).send('Error occured!');
};

app.use(errorMiddleWare);

app.listen(3000, () => {
    console.log('Listening on port 3000');
});

