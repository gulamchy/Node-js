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
        fromPhone: '+18779163778',
        accountSid: 'ACc05e14cdc4495c50a288c35293bf6a58',
        authToken: '5a5ac121fd975771548fbb3102ca805f'
    }
};

environments.production = {
    port: 5001,
    envName: 'production',
    secretKey: 'lgkidporsjigpwnfusmk',
    maxChecks: 5,
    twilio: {
        fromPhone: '+18779163778',
        accountSid: 'ACc05e14cdc4495c50a288c35293bf6a58',
        authToken: '5a5ac121fd975771548fbb3102ca805f'
    }
};

// Determine which environment was passed
const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging';

// Export corresponding environment object
const environmentToExport = typeof(environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.staging;

// Export Module
module.exports = environmentToExport;