/*
*
* Title: Token Handler
* Description: Handler for handling all token related stuff
* Author: Gulam Sulaman
* Date: 2024-09-12
*
*/

// Dependencies
const data      = require('../../lib/data');
const {parseJSON, hash, createRandomString}    = require('../../helpers/utilities');


// Module Scaffolding
const handler = {};

// Function
handler.tokenHandler = (requestProperties, callback) => {
    // Defining our accepted methods
    const acceptedMethods = ['get', 'post', 'put', 'delete'];

    // If requested method is in our accepted method, we proceed. 
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        //pass the requestProperties and callback function to the requested method
        handler._token[requestProperties.method](requestProperties, callback);
    } else {
        // Otherwise send the code for Method Not Allowed
        callback(405);
    }
}

// Making a private scaffolding for token methods and then declaring all the methods in it
handler._token = {};

// Generate the token
handler._token.post = (requestProperties, callback) => {

    const phoneNumber   = typeof(requestProperties.body.phoneNumber) === 'string' && requestProperties.body.phoneNumber.trim().length === 11 ? requestProperties.body.phoneNumber : false;

    const password      = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    if(phoneNumber && password) {
        // Lookup the user first
        data.read('users', phoneNumber, (readError, userData) => {
            let hashedPassword      = hash(password);

            if(hashedPassword === parseJSON(userData).password){
                const tokenId       = createRandomString(20);
                const expires       = Date.now() * 60 * 60 * 1000;
                const tokenObject   = {
                    phoneNumber,
                    id: tokenId,
                    expires
                };

                // store the token
                data.create('tokens', tokenId, tokenObject, (createError)=>{
                    if(!createError){
                        callback(200, tokenObject);
                    } else {
                        callback(500, {error: 'There was a server side error'});
                    }
                });
            }
        });
    } else {
        callback(400, {error: 'Invalid phone number or password. Request again !'});
    }
};

// Get the token
handler._token.get = (requestProperties, callback) => {
    const id = typeof requestProperties.queryStringObj.id === 'string' && requestProperties.queryStringObj.id.trim().length === 20 ? requestProperties.queryStringObj.id : false;

    if(id) {
        // Lookup the token
        data.read('tokens', id, (tokenError, tokenData) => {
            const token = {...parseJSON(tokenData)};
            if(!tokenError && token){
                callback(200, token);
            } else {
                callback(404, {
                    error: 'Requested token was not found!',
                });
            }
        });
    } else {
        callback(404, {error: 'Incorrect Token'});
    }
};

// Update the token
handler._token.put = (requestProperties, callback) => {
    const id = typeof requestProperties.body.id === 'string' && requestProperties.body.id.trim().length === 20 ? requestProperties.body.id : false;

    const extend = typeof requestProperties.body.extend === 'boolean' && requestProperties.body.extend === true ? true : false;

    if(id && extend) {
        data.read('tokens', id, (readError, tokenData) => {
            const tokenObj = parseJSON(tokenData);
            if(tokenObj.expires > Date.now()) {
                tokenObj.expires = Date.now() + 60 * 60 * 1000;

                // update the token
                data.update('tokens', id, tokenObj, (updateError) =>{
                    if(!updateError){
                        callback(200, {message: 'Updated Successfully'});
                    } else {
                        callback(500, {error: 'There was a server side error'});
                    }  
                })
            } else {
                callback(400, {error: 'Token already expired!'});
            }
        })
    } else {
        callback(404, {error: 'Incorrect Token'});
    }
};

// Delete the token
handler._token.delete = (requestProperties, callback) => {
    const id = typeof requestProperties.queryStringObj.id === 'string' && requestProperties.queryStringObj.id.trim().length === 20 ? requestProperties.queryStringObj.id : false;

    if(id) {
        // Lookup the token
        data.read('tokens', id, (tokenError, tokenData) => {

            if(!tokenError && tokenData){
                // Delete token
                data.delete('tokens', id, (deleteError) => {
                    if(!deleteError){
                        callback(200, {
                            message: 'Token was successfully deleted!',
                        });
                    } else {
                        callback(500, {
                            error: 'There was a server side error',
                        });
                    }
                });
            } else {
                callback(404, {
                    error: 'Requested token was not found!',
                });
            }
        });
    } else {
        callback(404, {error: 'Incorrect Token'});
    }
};


// General Function call for authentication of user call
handler._token.varify = (id, phoneNumber, callback) => {
    data.read('tokens', id, (readError, tokenData) => {
        if(!readError && tokenData) {
            if(parseJSON(tokenData).phoneNumber === phoneNumber && parseJSON(tokenData).expires > Date.now()){
                callback(true);
            } else{
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};

// Exporting
module.exports = handler;

