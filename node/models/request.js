/*jslint node: true*/
'use strict';

var TimestampsPlugin = require('mongoose-timestamp');
var backend = require('beamjs').backend();
var model = backend.model();

module.exports.request = model({

    name: "x"
}, {
        requester: {
            
            id: Number,
            name: String
        },
       
        text: text,
        priority: Number,
        accepted: Boolean
    }, [TimestampsPlugin]);



