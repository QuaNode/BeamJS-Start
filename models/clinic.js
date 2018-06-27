/*jslint node: true*/
'use strict';

var TimestampsPlugin = require('mongoose-timestamp');
var backend = require('beamjs').backend();
var model = backend.model();

module.exports.clinic = model({

    name: "clinic"
}, {
        id: Number,
        name: String,
        working_days: [{
            id: Number,
            day: String,
            from: String,
            to: String
        }],
        doctors: [{
            id: Number,
            name: String
        }],
        location: String,
        contact: { // in case of not hospital
            building_number: String,
            street: String,
            floor_number: String,
            appartment_number: String,
            city: String,
            area: String,
            mobile_number: [String]
        }
    }, [TimestampsPlugin]);