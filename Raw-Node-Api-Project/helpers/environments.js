/*
*
* Title: Environments
* Description: Handle all environment related things
* Author: Gulam Sulaman
* Date: 2024-09-10
*
*/

// Dependencies

// Module Scaffolding
const environments = {};

// Functions // Objects
environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'oghywkmshnbforjslrija',
    maxChecks: 5,
    twilio: {
        fromPhone: 'process.env.TWILIO_FROM_PHONE',
        accountSid: 'process.env.TWILIO_ACCOUNT_SID',
        authToken: 'process.env.TWILIO_AUTH_TOKEN'
    }
};

environments.production = {
    port: 5001,
    envName: 'production',
    secretKey: 'lgkidporsjigpwnfusmk',
    maxChecks: 5,
    twilio: {
        fromPhone: 'process.env.TWILIO_FROM_PHONE',
        accountSid: 'process.env.TWILIO_ACCOUNT_SID',
        authToken: 'process.env.TWILIO_AUTH_TOKEN'
    }
};

// Determine which environment was passed
const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging';

// Export corresponding environment object
const environmentToExport = typeof(environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.staging;

// Export Module
module.exports = environmentToExport;
