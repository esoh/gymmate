const express = require('express');
const path = require('path'); // core module
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express(); // create an express application
const port = 8080;// use whatever port to test

// we want to make this public so any domain can access it but also restrict
// routes if the correct token is not provided.
app.use(cors()); // set whole app to use cors

//body parser middleware
app.use(bodyParser.json());

// route http: / to the callback function defined below.
// This function is called when a GET http request to "/" is made.
app.get('/', (req, res) => {
   res.send('Invalid Endpoint');
});

// () => {//code here} is a callback function that is called inside listen.
// You can also replace it with function(){//code here}
app.listen(port, () => {
   console.log('Server started on port ' + port);
});
