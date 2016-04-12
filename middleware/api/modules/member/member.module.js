/**
 * Created by Neha on 4/6/2016.
 */


'use strict';

var express = require('express'),
    mongoose = require('mongoose'),
    _ = require('lodash');

module.exports = function (services, config) {
    var moduleApp = express(),
        moduleRoutes = express.Router(),
        modulePath = '/api/member';

    var ccisroomDb = mongoose.connect(config.db.ccisroom);
    services.member = require('./services/member.service.js')(ccisroomDb);
    require('./routes/member.routes.js')(moduleRoutes, services.member);
    moduleApp.use(modulePath, moduleRoutes);
    return moduleApp;
};