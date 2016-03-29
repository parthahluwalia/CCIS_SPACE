/**
 * Created by Neha on 3/25/2016.
 */
'use strict';

var express = require('express'),
    mongoose = require('mongoose'),
    _ = require('lodash');

module.exports = function (services, config) {
    var moduleApp = express(),
        moduleRoutes = express.Router(),
        modulePath = '/api/space';

    // Connect to ccisroom database
    var ccisroomDb = mongoose.connect(config.db.ccisroom);

    // Load module services
    services.space = require('./services/space.service.js')(ccisroomDb);

    // Load routes
    require('./routes/space.routes.js')(moduleRoutes, services.space);

    // Attach routes
    moduleApp.use(modulePath, moduleRoutes);
    return moduleApp;
};