/*jslint node: true*/
'use strict';

var TimestampsPlugin = require('mongoose-timestamp');
var backend = require('beamjs').backend();
var model = backend.model();

module.exports.x = model({

    name: "x"
}, {
        id: Number,
        name: String,
        working_days: [{
            id: Number,
            day: String,
            from: String,
            to: String
        }]
    }, [TimestampsPlugin]);