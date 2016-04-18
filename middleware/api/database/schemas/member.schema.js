'use strict';

var mongoose = require('mongoose'),
    bcrypt   = require('bcrypt-nodejs');

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

// generating a hash
Schema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
Schema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = Schema;