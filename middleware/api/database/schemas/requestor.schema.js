'use strict';

var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    name: {
        first: String,
        last: String
    },
    lastModified: {
        type: Date,
        default: Date.now()
    }
}, { collection: 'requestor' });

module.exports = Schema;