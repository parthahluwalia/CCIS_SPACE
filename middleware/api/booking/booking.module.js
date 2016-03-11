'use strict';

var express = require('express');

module.exports = function () {
    var moduleApp = express(),
        moduleRoutes = express.Router(),
        modulePath = '/api/booking';

    // Load routes
    require('./routes/booking.routes.js')(moduleRoutes);

    // Attach routes
    moduleApp.use(modulePath, moduleRoutes);
    return moduleApp;
};