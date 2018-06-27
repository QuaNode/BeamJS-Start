/*jslint node: true*/
'use strict';

var TimestampsPlugin = require('mongoose-timestamp');
var backend = require('beamjs').backend();
var model = backend.model();

module.exports.template = model({

    name: "drug"
}, {
        id: Number,
        name: String,
        category: String
    }, [TimestampsPlugin]);