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
};

environments.production = {
    port: 5001,
    envName: 'production',
    secretKey: 'lgkidporsjigpwnfusmk',
};

// Determine which environment was passed
const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging';

// Export corresponding environment object
const environmentToExport = typeof(environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.staging;

// Export Module
module.exports = environmentToExport;