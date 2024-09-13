/*
*
* Title: Handle Request Response
* Description: Handle request and response from server
* Author: Gulam Sulaman
* Date: 2024-09-09
*
*/

// Dependencies
const url                   = require('url');
const {StringDecoder}       = require('string_decoder');
const routes                = require('../routes');
const {notFoundHandler}     = require('../handlers/routeHandlers/notFoundHandler');
const {parseJSON}           = require('../helpers/utilities');

// Handle object -  Module Scaffolding
const handler = {}

// Handle Function to work with request and response
handler.handleReqRes = (req, res) => {
    /*
        Request Handling Steps:
        1. Get the URL
            - Retrieve the full URL from the `req.url`.
            - We set the `true` parameter to include all components of the URL (e.g., path, query string).
        2. Parse the URL Elements
            - Break down the URL into its components for easier handling.
        3. Get the Path Name
            - Trim the route path to ensure it matches regardless of whether the user adds leading or trailing slashes (`/`).
            - A regular expression is used to preserve slashes within the path, ensuring proper routing.
        4. Get the Request Method
            - Convert the HTTP method (GET, POST, etc.) to lowercase to avoid case sensitivity issues.
        5. Get the Query String
            - The query string is part of the URL used to pass data to the server.
        6. Headers Object
            - Headers contain metadata about the request, which the server sends continuously.
            - We can also send custom headers from the client if needed.
        7. Body Object
            - This contains the data sent from the HTML body (e.g., form data).
            - The `string_decoder` module is used to decode the buffer, as recommended by Node.js for handling request bodies.
    */


   const parsedUrl      = url.parse(req.url, true)
   const path           = parsedUrl.pathname;
   const trimmedPath    = path.replace(/^\/+|\/+$/g, '');
   const method         = req.method.toLowerCase();
   const queryStringObj = parsedUrl.query;
   const headersObj     = req.headers;


    /*
        Routing Logic:
        1. Create Request Properties Object:
            - Construct an object `requestProperties` containing the parsed URL, path, trimmed path, method, query string, and headers.
        2. Route Selection:
            - Use `trimmedPath` to look up the corresponding handler in the `routes` object.
            - If no matching route is found, fall back to `notFoundHandler`.
        3. Handle the Request:
            - Call the selected route handler, passing `requestProperties` and a callback function.
            - The callback function processes the response, ensuring the status code and payload are valid and then sends the response to the client.
    */

   const requestProperties = {
        parsedUrl,
        path,
        trimmedPath,
        method,
        queryStringObj,
        headersObj,
   };
   
   // Choose handler based on the trimmed path or default to notFoundHandler
   const chosenHandler  = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;
   

   // Body Object 
   const decoder        = new StringDecoder('utf-8');
   let realData         = '';

   req.on('data', (buffer) => {
        realData        += decoder.write(buffer);
   })
   
   // when buffer ends, turn off the decoder and write to the file. 
   req.on('end', (buffer) => {
        realData        += decoder.end();
        requestProperties.body = parseJSON(realData);

        // Execute the handler
        chosenHandler(requestProperties, (statusCode, payload) => {
            statusCode  = typeof(statusCode) === 'number' ? statusCode : 500;
            payload     = typeof(payload) === 'object'? payload : {};

            // We can't send it as valid json object, we need to convert it to string (stringify).
            const payloadString = JSON.stringify(payload);

            // Return the final response
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(statusCode);
            res.end(payloadString);
        });
   })


}


module.exports = handler;
