'use strict';

module.exports = function (ccisroomDb) {
	var RequestorSchema = require('../schemas/requestor.schema.js');

    // Pre-save hook to store update date
    RequestorSchema.pre('save', function (next) {
        this.lastModified = new Date();
        next();
    });

    return ccisroomDb.model('Requestor', RequestorSchema);
};