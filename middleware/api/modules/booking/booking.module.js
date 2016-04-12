'use strict';

var express = require('express'),
    mongoose = require('mongoose'),
    _ = require('lodash');

module.exports = function (services, config) {
    var moduleApp = express(),
        moduleRoutes = express.Router(),
        modulePath = '/api/booking';

    // Connect to ccisroom database
    // var ccisroomDb = mongoose.connect(config.db.ccisroom);
    var ccisroomDb = config.db.ccisroom;

    // Load module services
    services.booking = require('./services/booking.service.js')(ccisroomDb);

    // Load routes
    require('./routes/booking.routes.js')(moduleRoutes, services.booking);

    // Attach routes
    moduleApp.use(modulePath, moduleRoutes);
    return moduleApp;
};