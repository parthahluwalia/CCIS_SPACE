'use strict';

var mongoose = require('mongoose');

// Define member tags
var TAG_USER = 'user',
    TAG_ADMIN = 'admin';

// Define member schema
var Schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        first: String,
        last: String
    },
    password: String,
    tags: [
        { type: String }
    ],
    phone: String,
    lastModified: {
        type: Date,
        default: Date.now()
    }
}, { collection: 'member' });

module.exports = Schema;