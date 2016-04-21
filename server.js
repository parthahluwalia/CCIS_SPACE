'use strict';

//  Load external packages
var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');

// Express Configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

// We need to get services based off of some config, how about creating a global service module like the one holding et.js, ses.js!?
var services = {},
    config = require('./middleware/api/config')(process.env);

// Passport Configuration - pass database and passport object as args
require('./middleware/api/config/passport.config.js')(config.db.ccisroom, passport);

// required for passport
app.use(session({ secret: 'northeasternhuskiesccis' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// Add passport to config object
config.passport = passport;

// Load Middleware API modules
require('./middleware/api')(app, services, config);

// Start the server
console.log('Express server listening on port ' + port);
var server = app.listen(port, ipaddress);

// Commenting! -- Why the hell are we exporting server 
module.exports = server;
