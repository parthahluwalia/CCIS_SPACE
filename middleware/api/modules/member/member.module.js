'use strict';

var express = require('express'),
    mongoose = require('mongoose'),
    _ = require('lodash');

module.exports = function (services, config) {
    var moduleApp = express(),
        moduleRoutes = express.Router(),
        modulePath = '/api/member',
        ccisroomDb = config.db.ccisroom,
        passport = config.passport;

    // var ccisroomDb = mongoose.connect(config.db.ccisroom);
    // Load module services
    services.member = require('./services/member.service.js')(ccisroomDb, passport);

    // Load routes
    require('./routes/member.routes.js')(moduleRoutes, services.member, passport);
    
    // Attach routes
    moduleApp.use(modulePath, moduleRoutes);

    return moduleApp;
};