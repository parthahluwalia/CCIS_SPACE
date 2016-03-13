'use strict';

var express = require('express');

module.exports = function (services) {
    var moduleApp = express(),
        moduleRoutes = express.Router(),
        modulePath = '/api/booking',
        services;

     // Load module services
    services.booking = require('./services/booking.service.js')();

    // Load routes
    require('./routes/booking.routes.js')(moduleRoutes, services.booking);

    // Attach routes
    moduleApp.use(modulePath, moduleRoutes);
    return moduleApp;
};