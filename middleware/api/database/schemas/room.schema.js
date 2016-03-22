'use strict';

var mongoose = require('mongoose');

// Define schema types
var ObjectId = mongoose.Schema.Types.ObjectId;

var Schema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: true
    },
    details: {
        projector: {
            type: Boolean,
            default: false
        },
        blueJeans: {
            type: Boolean,
            default: false
        },
        capacity: Number
    },
    description: {
        type: String,
        default: 'Default description'
    },
    lastModified: {
        type: Date,
        default: Date.now()
    }
}, { collection: 'room' });

module.exports = Schema;