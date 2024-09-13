/*
*
* Title: User Handler
* Description: Handler for handling all user related stuff
* Author: Gulam Sulaman
* Date: 2024-09-11
*
*/

// Dependencies
const data      = require('../../lib/data');
const {hash, parseJSON}    = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');

// Module Scaffolding
const handler   = {}

// Function
handler.userHandler = (requestProperties, callBack) => {
    // Defining our accepted methods
    const acceptedMethods = ['get', 'post', 'put', 'delete'];

    // If requested method is in our accepted method, we proceed. 
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        //pass the requestProperties and callback function to the requested method
        handler._user[requestProperties.method](requestProperties, callBack);
    } else {
        // Otherwise send the code for Method Not Allowed
        callBack(405);
    }
};

// Making a private scaffolding for user methods and then declaring all the methods in it
handler._user = {};

// Creating the User
handler._user.post = (requestProperties, callBack) => {
    const firstName = typeof(requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;

    const lastName = typeof(requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;

    const phoneNumber = typeof(requestProperties.body.phoneNumber) === 'string' && requestProperties.body.phoneNumber.trim().length === 11 ? requestProperties.body.phoneNumber : false;

    const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    // const termsAgreement = typeof(requestProperties.body.termsAgreement) === 'boolean' && requestProperties.body.termsAgreement.trim().length > 0 ? requestProperties.body.termsAgreement : false;
    const termsAgreement = typeof(requestProperties.body.termsAgreement) === 'boolean'? requestProperties.body.termsAgreement : false;

    if (firstName && lastName && phoneNumber && password && termsAgreement) {
        // Make sure the user does not exists already
        data.read('users', phoneNumber, (readError, user) => {
            // Error means there was no user exist, so we proceed to create one.
            if(readError){
                // Creating userObject to pass it to user creation function
                let userObject = {
                    firstName,
                    lastName,
                    phoneNumber,
                    password: hash(password),
                    termsAgreement,
                };
                // Store user to db
                data.create('users', phoneNumber, userObject, (createError) => {
                    if(!createError){
                        callBack(200, {message: 'User was created successfully!'});
                    } else {
                        callBack(500, {error: 'Could not create user!'});
                    }
                })
            }
            else{
                callBack(500, {
                    error: 'There was a problem in server side',
                })
            }
        });

    } else {
        callBack(400, {
            error: 'You have a problem in your request',
        })
    }

};

// Fetching the User
handler._user.get = (requestProperties, callBack) => {
    // Validating the phoneNumber
    const phoneNumber = typeof(requestProperties.queryStringObj.phoneNumber) === 'string' && requestProperties.queryStringObj.phoneNumber.trim().length === 11 ? requestProperties.queryStringObj.phoneNumber : false;

    // if Phone number is validated, we proceeds
    if(phoneNumber){
        // varify Token
        let token = typeof (requestProperties.headersObj.token) === 'string' ? requestProperties.headersObj.token : false;

        tokenHandler._token.varify(token, phoneNumber, (tokenStatus) => {
            if(tokenStatus){
                // Read user from data
                data.read('users', phoneNumber, (readError, userInfo) => {
                    // Converting it to valid js object
                    const user = { ...parseJSON(userInfo)};

                    if(!readError && user){
                        // we don't want to return the password, so delete it from the variable ( not from the data/db )
                        delete user.password;
                        callBack(200, user);
                    } else{
                        callBack(404, {error: 'Requested user was not found!'});
                    }
                });
            }else {
                callBack(403, {error: 'Authentication failed!'});
            }
        });
    } else {
        callBack(404, {error: 'Requested user was not found!'});
    }

};

// Updating the User
handler._user.put = (requestProperties, callBack) => {
    // Validating the phoneNumber
    const phoneNumber = typeof(requestProperties.body.phoneNumber) === 'string' && requestProperties.body.phoneNumber.trim().length === 11 ? requestProperties.body.phoneNumber : false;

    const firstName = typeof(requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;

    const lastName = typeof(requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;

    const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;
    if(phoneNumber){
        if(firstName || lastName || password) {
            // varify Token
            let token = typeof (requestProperties.headersObj.token) === 'string' ? requestProperties.headersObj.token : false;

            tokenHandler._token.varify(token, phoneNumber, (tokenStatus) => {
                if(tokenStatus){
                    // Lookup the user
                    data.read('users', phoneNumber, (readError, uData) => {
                        const userData = {...parseJSON(uData)};

                        if(!readError && uData) {
                            if(firstName) {
                                userData.firstName = firstName;
                            }

                            if(lastName) {
                                userData.lastName = lastName;
                            }

                            if(password) {
                                userData.password = hash(password);
                            }

                            // Update the user info
                            data.update('users',phoneNumber, userData, (updateError) => {
                                if(!updateError){
                                    callBack(200, {
                                        message: 'User was updated successfully'
                                    });
                                } else {
                                    callBack(500, {error: 'There was an error on the server side while updating the user.'});
                                }
                            })

                        } else {
                            callBack(400, {error: 'User does not exist with the provided phone number. '});
                        }
                    }); 

                }else {
                    callBack(403, {error: 'Authentication failed!'});
                }
            });

        } else {
            callBack(400, {error: 'Missing fields to update. Please provide firstName, lastName, or password.'});
        }

    } else {
        callBack(400, {error: 'Invalid phone number. Make sure it is 11 characters long.'});
    }


};


// Deleting the User
handler._user.delete = (requestProperties, callBack) => {
    // Validate the phoneNumber
    const phoneNumber = typeof(requestProperties.queryStringObj.phoneNumber) === 'string' && requestProperties.queryStringObj.phoneNumber.trim().length === 11 ? requestProperties.queryStringObj.phoneNumber : false;

    if(phoneNumber) {
        // varify Token
        let token = typeof (requestProperties.headersObj.token) === 'string' ? requestProperties.headersObj.token : false;

        tokenHandler._token.varify(token, phoneNumber, (tokenStatus) => {
            if(tokenStatus){
                // Lookup the user
                data.read('users', phoneNumber, (readError, userData) => {
                    if(!readError && userData){
                        // Proceed to Delete
                        data.delete('users', phoneNumber, (deleteError) => {
                            if(!deleteError) {
                                callBack(200, {message: 'User was successfully deleted!'});
                            } else {
                                callBack(500, {error: 'There was an error on the server side while deleting the user!'});
                            }
                        });
                    } else {
                        callBack(500, {error: 'There was an error on the server side while searching for user!'});
                    }
                });
            }else {
                callBack(403, {error: 'Authentication failed!'});
            }
        });

    } else {
        callBack(400, { error: 'Invalid phone number. Make sure it is 11 characters long.' });
    }
};


// Exporting
module.exports = handler;