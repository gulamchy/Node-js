/*
*
* Title: Data Management 
* Description: We are going to manage the data CRUD locally in our machine
* Author: Gulam Sulaman
* Date: 2024-09-10
*
*/

// Dependencies
const fs    = require('fs');
const path  = require('path');


// Module Scaffolding
const dataLib = {};

// Base directoru of the data folder
dataLib.baseDir = path.join(__dirname, '/../.data/');

// Write Data to file
dataLib.create = (dir, file, data, callback) => {
    // Open file for writing
    fs.open(`${dataLib.baseDir+dir}/${file}.json`, 'wx', (openError, fileDescriptor) => {
        if(!openError && fileDescriptor){
            // Convert data to string
            const stringData = JSON.stringify(data);

            // Write data to file and then close it
            fs.writeFile(fileDescriptor, stringData, (writeError)=>{
                if(!writeError){
                    // No error, So now we will close it
                    fs.close(fileDescriptor, (closeError) => {
                        if(!closeError){
                            callback(false);
                        } else {
                            // Could not close, so sending callback function with error message
                            callback('Error closing the new file');
                        }
                    });

                } else{
                    // Could not write, so sending callback function with error message
                    callback('Error writing to new file');
                }
            });

        } else {
            // Could not open, so sending callback function with error message
            callback('Could not create new file, it may already exists');
        }
    });
};

// Read Data from file
dataLib.read = (dir, file, callback) => {
    fs.readFile(`${dataLib.baseDir+dir}/${file}.json`, 'utf8', (rearError, data) => {
        callback(rearError, data);
    });
};

// Update Existing File
dataLib.update = (dir, file, data, callback) => {
    fs.open(`${dataLib.baseDir+dir}/${file}.json`, 'r+', (openError, fileDescriptor) => {
        if(!openError && fileDescriptor){
            //Convert the Data to string
            const stringData = JSON.stringify(data);
            // Truncate the file
            fs.ftruncate(fileDescriptor, (truncateError) => {
                if(!truncateError) {
                    // Write to the file and close it
                    fs.writeFile(fileDescriptor, stringData, (writeError) => {
                        if(!writeError){
                            // Close the file
                            fs.close(fileDescriptor, (closeError) => {
                                if(!closeError){
                                    callback(false);
                                } else{
                                    callback(`Error closing the file`);
                                }
                            })
                        }else{
                            callback(`Error writing to file`);
                        }
                    })
                } else{
                    callback(`Error truncating file`);
                }
            })

        }else{
            callback(`Error updating. File may not exists`);
        }
    });
};

// Delete existing File
dataLib.delete = (dir, file, callback) => {
    fs.unlink(`${dataLib.baseDir+dir}/${file}.json`,(deleteError) =>{
        if(!deleteError) {
            callback(false);
        } else{
            callback(`Error delete the file`);
        }
    } )
};

// List all the items in a directory
dataLib.listOfFiles = (dir, callback) => {
    fs.readdir(`${dataLib.baseDir + dir}/`, (isReadError, fileNames) => {
        if(!isReadError && fileNames && fileNames.length > 0) {
            // Remove .json extension cause we only need the name of the file
            const trimmedFileNames = [];
            fileNames.forEach((fileName) => {
                trimmedFileNames.push(fileName.replace('.json', ''));
            });
            callback(false, trimmedFileNames);


        } else {
            callback('Error reading directory');
        }
    })
};

// Exporting Module
module.exports = dataLib;

