/*
*
* Title: Workers Library
* Description: Background work Related Files
* Author: Gulam Sulaman
* Date: 09/16/2024
*
*/




// Dependencies
const url = require('url');
const data = require("./data");
const {parseJSON} = require('../helpers/utilities');
const http = require('http');
const https = require('https');
const {sendTwilioSms} = require('../helpers/notificaton');

// Server object - Module Scaffolding
const worker = {};

// Lookup all the checks
worker.gatherAllChecks = () => {
    // get the checks
    data.listOfFiles('checks', (isFileReadError, checkFiles) => {
        if(!isFileReadError && checkFiles && checkFiles.length > 0) {
            checkFiles.forEach((checkName) => {
                // Read individual check
                data.read('checks', checkName, (isCheckError, singleCheckData) => {
                    if(!isCheckError && singleCheckData){
                        // Pass the data to check validator
                        let checkData = parseJSON(singleCheckData);
                        worker.validateCheckData(checkData);

                    } else {
                        console.log(`Error: reading single check data.\n ${isCheckError}`);
                    }
                });
            });
        } else {
            console.log('Error: Could not find any checks to proceeds');
        }
    });
};

// Validate single check data
worker.validateCheckData = (singleCheckData) => {
    let checkData = singleCheckData;
    if(singleCheckData && singleCheckData.id) {
        checkData.state = typeof(checkData.state) === 'string' && ['up', 'down'].indexOf(checkData.state) > -1 ? checkData.state : 'down';
        checkData.lastChecked = typeof(checkData.lastChecked) === 'number' && checkData.lastChecked > 0 ? checkData.lastChecked : false;

        // Pass check data to perform
        worker.performCheck(checkData);  
    } else {
        console.log('Error: Check was invalid or not properly formatted!');
    }
};

// Perform Check
worker.performCheck = (singleCheckData) => {
    // Prepare the initial check outcome
    let checkOutcome = {
        'error': false,
        'responseCode': false
    };

    // Mark the outcome has not been sent yet
    let outcomeSent = false;

    // parse the hostname & full url from signle check data
    let parseURL = url.parse(singleCheckData.protocol + '://' + singleCheckData.url, true);
    const hostname = parseURL.hostname;
    const path = parseURL.path;

    // Construct the request
    const requestDetails = {
        'protocol': singleCheckData.protocol + ':',
        'hostname': hostname,
        'method': singleCheckData.method.toUpperCase(),
        'path': path,
        'timeout': singleCheckData.timeOutSeconds * 1000,
    };

    const protocolToUse = singleCheckData.protocol === 'http'? http : https;

    let req = protocolToUse.request(requestDetails, (res) => {
        // Grab the status of the response
        const status = res.statusCode;

        checkOutcome.responseCode = status;

        // Update the check outcome and pass to the next process
        if(!outcomeSent) {
            worker.processCheckOutcome(singleCheckData, checkOutcome);
            outcomeSent = true;
        }
    });

    req.on('error', (e) => {

        checkOutcome = {
            'error': true,
            'value': e,
        };
        // Update the check outcome and pass to the next process
        if(!outcomeSent) {
            worker.processCheckOutcome(singleCheckData, checkOutcome);
            outcomeSent = true;
        }

    });

    req.on('timeout', (e) => {

        checkOutcome = {
            'error': true,
            'value': 'timeout',
        };
        // Update the check outcome and pass to the next process
        if(!outcomeSent) {
            worker.processCheckOutcome(singleCheckData, checkOutcome);
            outcomeSent = true;
        }
        
    });

    // Request send
    req.end();

}

// Check the check outcome and if the state changed or not
worker.processCheckOutcome = (singleCheckData, checkOutcome) => {
    // Check if check outcome is up or down
    let state = !checkOutcome.error && checkOutcome.responseCode && singleCheckData.successCodes.indexOf(checkOutcome.responseCode) > -1 ? 'up' : 'down';

    // Decide whether we should alert the user or not
    let alertWanted = !!(singleCheckData.lastChecked && singleCheckData.state !== state);

    // Update the check data
    let newCheckData = singleCheckData;

    newCheckData.state = state;
    newCheckData.lastChecked = Date.now();

    // Update the check to disk
    data.update('checks', newCheckData.id, newCheckData, (error) => {
        if(!error) {
            if(alertWanted){
                // Send the checkdata to next process
                worker.alertUserToStatusChange(newCheckData);
            } else {
                console.log('Alert is not needed as there is no state change');
            }
            
        } else {
            console.log('Trying to save check data of one of the checks!');
        }
    });

};

// Send alert to user
worker.alertUserToStatusChange = (newCheckData) => {
    let msg = `Alert: Your check for ${newCheckData.method.toUpperCase()}  ${newCheckData.protocol}://${newCheckData.url} is currently ${newCheckData.state}`;

    sendTwilioSms(newCheckData.userPhone, msg, (error) => {
        if(!error){
            //
            console.log(`User was alerted to a status change via SMS: ${msg}`);
        } else {
            console.log('There was a problem sending sms to one of your user!');
        }
    });
};

// Time to execute worker process once per minute
worker.loopChecks = () => {
    setInterval(() => {
        worker.gatherAllChecks();
    }, 8000);
};


// Start the worker
worker.init = () => {
    // Execute all the checks 
    worker.gatherAllChecks();

    // Loop through all the checks
    worker.loopChecks();
};


// Export the module
module.exports = worker;