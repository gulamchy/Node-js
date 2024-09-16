/*
*
* Title: Motification Library
* Description: Important functions to notify users
* Author: Gulam Sulaman
* Date: 2024-09-15
*
*/

// Dependencies
const https = require('https');
const { twilio } = require('./environments');
const querystring = require('querystring');
const { hostname } = require('os');

// Module Scaffolding
const notifications = {};


// Send sms to user using twilio api
notifications.sendTwilioSms = (phone, msg, callback) => {
    // Input Validation
    const userPhone = typeof (phone) === 'string' && phone.trim().length >= 10 ? phone.trim() : false;
    const userMsg = typeof (msg) === 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;

    if ( userMsg && userPhone) {
        // Twilio Request  Configuration
        const payload = {
            Body: userMsg,
            From: twilio.fromPhone,
            To: userPhone,
        };

        // Stringify the payload
        const stringifyPayload = querystring.stringify(payload);

        // Configure the https request details
        const requestDetails = {
            hostname: 'api.twilio.com',
            method: 'POST',
            path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
            auth: `${twilio.accountSid}:${twilio.authToken}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }  

        const req = https.request(requestDetails, (res) => {
            let response = '';

            res.on('data', (chunk) => {
                response += chunk;
            });

            res.on('end', () => {
                const status = res.statusCode;
                if (status === 200 || status === 201) {
                    callback(false); // Success
                } else {
                    callback(`Error: Status code returned was ${status}. Response: ${response}`);
                }
            });
        });

        req.on('error', (e) => {
            callback(`Request error: ${e.message}`);
        });

        req.write(stringifyPayload);  // Send the payload
        req.end();
    } else {
        callback('Given parameters were missing or invalid!');
    }
};

// Module Export
module.exports = notifications;