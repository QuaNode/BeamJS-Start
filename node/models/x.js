/*jslint node: true*/
'use strict';

var TimestampsPlugin = require('mongoose-timestamp');
var backend = require('beamjs').backend();
var model = backend.model();

module.exports.x = model({

    name: "x"
}, {
        name: String,
        working_days: [{
            
            day: String
        }]
    }, [TimestampsPlugin]);