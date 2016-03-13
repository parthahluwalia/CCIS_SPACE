'use strict';

// Load external packages
var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Express Configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

// Ummm, we need to get services based off of some config, how about creating a global service module like the one holding et.js, ses.js!
var services = {};
// Load Middleware API modules
require('./middleware/api')(app, services);

app.get('/foo', function (req, res) {
    res.status(200).send('Foo Bar on the main server.js file');
});

// Start the server
//console.log('Express server listening on port ' + port);
app.listen(port, ipaddress);

module.exports = app;