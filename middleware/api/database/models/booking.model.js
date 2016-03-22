'use strict';

module.exports = function (ccisroomDb) {
    var BookingSchema = require('../schemas/booking.schema.js');

    // Pre-save hook to store update date
    BookingSchema.pre('save', function (next) {
        this.lastModified = new Date();
        next();
    });

    return ccisroomDb.model('Booking', BookingSchema);
};