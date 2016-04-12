'use strict';

var mongoose = require('mongoose');

// Define schema types
var ObjectId = mongoose.Schema.Types.ObjectId;

var Schema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: true,
        unqiue: true
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
        capacity: {
            type: Number
        }
    },
    active:{
        type:Boolean,
        default:true
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