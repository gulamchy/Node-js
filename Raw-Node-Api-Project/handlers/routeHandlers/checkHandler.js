/*
*
* Title: Check Handler
* Description: Handler for handling all checking related stuff
* Author: Gulam Sulaman
* Date: 2024-09-14
*
*/

// Dependencies
const data                                          = require('../../lib/data');
const {hash, parseJSON, createRandomString}         = require('../../helpers/utilities');
const tokenHandler                                  = require('./tokenHandler');
const {maxChecks}                                   = require('../../helpers/environments');


// Module Scaffolding
const handler   = {}

// Function
handler.checkHandler = (requestProperties, callback) => {
    // Defining our accepted methods
    const acceptedMethods = ['get', 'post', 'put', 'delete'];

    // If requested method is in our accepted method, we proceed. 
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        //pass the requestProperties and callback function to the requested method
        handler._check[requestProperties.method](requestProperties, callback);
    } else {
        // Otherwise send the code for Method Not Allowed
        callback(405);
    }
};

// Making a private scaffolding for check methods and then declaring all the methods in it
handler._check = {};

// Creating the check
handler._check.post = (requestProperties, callback) => {
    // Validate Inputs
    let protocol = typeof (requestProperties.body.protocol) === 'string' && ['http', 'https'].indexOf(requestProperties.body.protocol)  > -1 ? requestProperties.body.protocol : false;
    let url = typeof (requestProperties.body.url) === 'string' && requestProperties.body.protocol.trim().length  > 0 ? requestProperties.body.url : false;
    let method = typeof (requestProperties.body.method) === 'string' && ['POST', 'GET', 'PUT', 'DELETE'].indexOf(requestProperties.body.method)  > -1 ? requestProperties.body.method : false;
    let successCodes = typeof (requestProperties.body.successCodes) === 'object' && requestProperties.body.successCodes instanceof Array ? requestProperties.body.successCodes : false;
    let timeOutSeconds = typeof (requestProperties.body.timeOutSeconds) === 'number' && requestProperties.body.timeOutSeconds >= 1 && requestProperties.body.timeOutSeconds <= maxChecks? requestProperties.body.timeOutSeconds : false;

    if(protocol && url && method && successCodes && timeOutSeconds) {
        const token = typeof(requestProperties.headersObj.token) === 'string' ? requestProperties.headersObj.token : false;
        // Lookup the token expired or not
        data.read('tokens', token, (tokenError, tokenData) => {
            if(!tokenError && tokenData){
                let userPhone = parseJSON(tokenData).phoneNumber;

                // Lookup the user data
                data.read('users', userPhone, (userError, userData) => {
                    if(!userError && userData){
                        //
                        tokenHandler._token.varify(token, userPhone, (tokenIsValid) => {
                            if(tokenIsValid){
                                // retrieving user data
                                let userObject = parseJSON(userData); 
                                let userChecks = typeof(userObject.checks) === 'object' && userObject.checks instanceof Array ? userObject.checks : [];
                                if(userChecks.length <= maxChecks){
                                    let checkId = createRandomString(20);
                                    let checkObject = {
                                        id: checkId,
                                        userPhone,
                                        protocol,
                                        url,
                                        method,
                                        successCodes,
                                        timeOutSeconds
                                    }

                                    // Creating check using checkID
                                    data.create('checks', checkId, checkObject, (checkError) => {
                                        if(!checkError){
                                            // Add checkId in user object
                                            userObject.checks = userChecks;
                                            userObject.checks.push(checkId);

                                            // update the user data with new checks
                                            data.update('users', userPhone, userObject, (userDataUpdateError) => {
                                                if(!userDataUpdateError){
                                                    callback(200, checkObject);
                                                }
                                                else{
                                                    callback(500, {error: 'There was a server side error'});
                                                }
                                            });
                                        }
                                        else{
                                            callback(500, {error: 'There was a server side error'});
                                        }
                                    });
                                } else {
                                    callback(401, {error: 'Check limit reached!' });
                                }
                            } else {
                                callback(403, {error: 'Authentication Failed!'} );
                            }
                        })
                    }
                    else {
                        callback(403, {error: 'user not found!'});
                    }
                });
            } else {
                callback(403, {error: 'Authentication Failed!'});
            }
        });
    } else {
        callback(400, {
            error: 'Invalid input in your request!',
        })
    }

};

// Fetching the check
handler._check.get = (requestProperties, callback) => {
    // Validate the id of request 
    const id = typeof requestProperties.queryStringObj.id === 'string' && requestProperties.queryStringObj.id.trim().length === 20 ? requestProperties.queryStringObj.id : false;

    if(id) {
        data.read('checks', id, (checkError, checkData) => {
            let checkObject = parseJSON(checkData);
            if(!checkError && checkData){
                const token = typeof(requestProperties.headersObj.token) === 'string' ? requestProperties.headersObj.token : false;
                tokenHandler._token.varify(token, checkObject.userPhone, (tokenIsValid) => {
                    if(tokenIsValid){
                        callback(200, checkObject);
                    } else {
                        callback(403, {error: 'Authentication failed!'});
                    }
                })
            } else {
                callback(500, {error: 'There was a server side error!'});
            }
        })
    } else {
        callback(400, {error: 'Invalid Requests!'});
    }
};

// Updating the check
handler._check.put = (requestProperties, callback) => {
    const id = typeof (requestProperties.body.id) === 'string' && requestProperties.body.id.trim().length === 20 ? requestProperties.body.id : false;
    // Validate Inputs
    let protocol = typeof (requestProperties.body.protocol) === 'string' && ['http', 'https'].indexOf(requestProperties.body.protocol)  > -1 ? requestProperties.body.protocol : false;
    let url = typeof (requestProperties.body.url) === 'string' && requestProperties.body.protocol.trim().length  > 0 ? requestProperties.body.url : false;
    let method = typeof (requestProperties.body.method) === 'string' && ['POST', 'GET', 'PUT', 'DELETE'].indexOf(requestProperties.body.method)  > -1 ? requestProperties.body.method : false;
    let successCodes = typeof (requestProperties.body.successCodes) === 'object' && requestProperties.body.successCodes instanceof Array ? requestProperties.body.successCodes : false;
    let timeOutSeconds = typeof (requestProperties.body.timeOutSeconds) === 'number' && requestProperties.body.timeOutSeconds >= 1 && requestProperties.body.timeOutSeconds <= maxChecks? requestProperties.body.timeOutSeconds : false;

    if (id) {
        if(protocol || url || method || successCodes || timeOutSeconds){
            // Lookup the check data
            data.read('checks', id, (checkError, checkData) => {
                if(!checkError && checkData){
                    const checkObject = parseJSON(checkData);
                    const token = typeof(requestProperties.headersObj.token) === 'string' ? requestProperties.headersObj.token : false;
                    tokenHandler._token.varify(token, checkObject.userPhone, (tokenIsValid) => {
                        if(tokenIsValid){
                            if(protocol){
                                checkObject.protocol = protocol;
                            }
                            if(url){
                                checkObject.url = url;
                            }
                            if(method){
                                checkObject.method = method;
                            }
                            if(successCodes){
                                checkObject.successCodes = successCodes;
                            }
                            if(timeOutSeconds){
                                checkObject.timeOutSeconds = timeOutSeconds;
                            }

                            // Update the check obejct to the file
                            data.update('checks', id, checkObject, (checkDataUpdateError) => {
                                if(!checkDataUpdateError){
                                    callback(200, {message: 'Check data updated successfully!'});
                                } else {
                                    callback(500, {error: 'There was a server side error!'});
                                }
                            })
                        }else{
                            callback(403, {error: 'Authentication failed!'});
                        }
                    });
                } else {
                    callback(500, {error: 'There was a server side error'});
                }
            });
        } else {
            callback(400, {error: 'You must provide one input field to update!'});
        }
    } else {
        callback(400, {error: 'Invalid input requests!'});
    }
};


// Deleting the check
handler._check.delete = (requestProperties, callback) => {
    // Validate the id of request 
    const id = typeof requestProperties.queryStringObj.id === 'string' && requestProperties.queryStringObj.id.trim().length === 20 ? requestProperties.queryStringObj.id : false;

    if(id) {
        data.read('checks', id, (checkError, checkData) => {
            let checkObject = parseJSON(checkData);
            if(!checkError && checkData){
                const token = typeof(requestProperties.headersObj.token) === 'string' ? requestProperties.headersObj.token : false;
                tokenHandler._token.varify(token, checkObject.userPhone, (tokenIsValid) => {
                    if(tokenIsValid){
                        data.delete('checks', id, (DeleteError) => {
                            if(!DeleteError){
                                data.read('users', checkObject.userPhone, (readError, userData) =>{
                                    let userObject = parseJSON(userData);
                                    if(!readError && userData) {
                                        const userChecks = typeof (userObject.checks) === 'object' && userObject.checks instanceof Array ? userObject.checks : [];
                                        let checkPosition = userChecks.indexOf(id);
                                        if(checkPosition > -1){
                                            // Remove from user checks data
                                            userChecks.splice(checkPosition, 1);

                                            // Resave the data
                                            userObject.checks = userChecks;
                                            data.update('users', userObject.phoneNumber, userObject, (updateError) => {
                                                if(!updateError){
                                                    callback(200, {message: 'Successfully deleted!'});
                                                }else {
                                                    callback(500, {error: 'There was a server side error while updating user check details!'});
                                                }
                                            });

                                        }
                                    } else{
                                        callback(500, {error: 'The check ID you are looking for is missing in user details!'});
                                    }
                                });

                            } else {
                                callback(500, {error: 'There was a server side error while deleting from checks folder!'});
                            }
                        })
                    } else {
                        callback(403, {error: 'Authentication failed!'});
                    }
                })
            } else {
                callback(500, {error: 'There was a server side error while reading the check file!'});
            }
        })
    } else {
        callback(400, {error: 'Invalid Requests!'});
    }
    
};


// Exporting
module.exports = handler;