const express = require("express");
const path = require("path");
const router = require('./src/router');

const app = express();

/* 
Right above our module.exports line, let's define a constant pathToIndex to represent the path to
 our index.html file. Call path.resolve(), and assign it to the constant we just created. 
 Let's pass __dirname as the first argument, and a string value of '../client/index.html' as the second argument */

const pathToIndex = path.resolve(__dirname, "../client/index.html");

/* Wire up the router

In ./api/app.js, let's go ahead and require our router from ./src/router. Before our previous app.use(), 
let's call the use() method again on our app object. Pass it the route '/' as the first argument and our
 router object as the second. */
app.use('/',router);

/* Serve static files

Let's call app.use() again, passing it express.static() as its only argument. 
Pass to express.static() a call to path.resolve(). 
You should call path.resolve() with the arguments __dirname and 'uploads', in that order. */
app.use(express.static(path.resolve(__dirname, 'uploads')));

/* Let's call the use() method of our app. For the route argument, 
let's pass a string of '/*'. For the route handler, we will pass an anonymous function that takes two parameters,
 request and response in that order. Our route handler should call the sendFile() method of our response parameter.
  As its first argument, use the path to the index file pathToIndex  */
app.use("/*", (request, response) => {
  response.sendFile(pathToIndex);
});

// export our app on the module.exports object.
module.exports = app;
