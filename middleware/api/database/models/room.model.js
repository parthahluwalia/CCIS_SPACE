'use strict';

module.exports = function (ccisroomDb) {
	var RoomSchema = require('../schemas/room.schema.js');

    // Pre-save hook to store update date
    RoomSchema.pre('save', function (next) {
        this.lastModified = new Date();
        next();
    });

    return ccisroomDb.model('Room', RoomSchema);
};