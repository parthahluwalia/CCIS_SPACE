'use strict';

/*module.exports = {
    dev: 'mongodb://localhost:27017',
    production: 'mongodb:prod'
};*/
var _ = require('lodash');

module.exports = function (processEnv, devDbName) {
    // Configure DB to have production or dev URL based on the environment the app is running
    var devDbUrl = 'mongodb://localhost:27017/' + devDbName, 
        dbConfig = _.has(processEnv, 'OPENSHIFT_MONGODB_DB_URL') ? processEnv.OPENSHIFT_MONGODB_DB_URL : devDbUrl;

    console.log('DB Config: ' + dbConfig);

    return dbConfig;
};