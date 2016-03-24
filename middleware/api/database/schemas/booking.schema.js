'use strict';

var mongoose = require('mongoose');

// Define booking status and minimum and maximum priority 
var BOOKING_CONFIRMED = 'confirmed',
    BOOKING_CANCELLED = 'cancelled',
    PRIORITY_MIN = 1,
    PRIORITY_MAX = 5,
    PRIORITY_DEFAULT = 3,
    PURPOSE_DEFAULT = 'Will add later Traitors!';

// Define schema types
var ObjectId = mongoose.Schema.Types.ObjectId;

// Define booking schema
var Schema = new mongoose.Schema({
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    purpose: {
        type: String,
        required: true,
        default: PURPOSE_DEFAULT
    },
    status: {
        type: String,
        enum: [BOOKING_CONFIRMED, BOOKING_CANCELLED],
        default: BOOKING_CONFIRMED
    },
    priority: {
        type: Number,
        min: PRIORITY_MIN,
        max: PRIORITY_MAX,
        required: true,
        default: PRIORITY_DEFAULT
    },
    createDate: Date,
    /*bookedBy: {      // ==> res.locals.memberId
        type: ObjectId,
        ref: 'Member'
    },*/
    room: {
        type: ObjectId,
        ref: 'Room',
        required: true
    },
    requestor: {
        type: ObjectId,
        ref: 'Requestor',
        required: true
    },
    lastModified: {
        type: Date,
        default: Date.now()
    }
}, { collection: 'booking' });

module.exports = Schema;