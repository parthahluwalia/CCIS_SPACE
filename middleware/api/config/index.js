'use strict';

var _ = require('lodash'),
	mongoose = require('mongoose');

module.exports = function (processEnv) {
	var config = {},
		dbUrl = require('./mongodb.config.js')(processEnv, 'ccisroom');

	// Connect to ccisroom database
    var ccisroomDb = mongoose.connect(dbUrl);

	// Add ccisroom db to config
	_.set(config, 'db.ccisroom', ccisroomDb);

	// console.log('DB in config: ', config, null, 2);

	// return config object
	return config;
};