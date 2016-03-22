'use strict';

var _ = require('lodash');

module.exports = function (processEnv) {
	var config = {},
		ccisroomDb = require('./mongodb.config.js')(processEnv, 'ccisroom'); // Connect to the ccisroom database

	// Add ccisroom db to config
	_.set(config, 'db.ccisroom', ccisroomDb);

	// return config object
	return config;
};