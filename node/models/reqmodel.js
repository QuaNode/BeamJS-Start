/*jslint node: true*/
'use strict';

var TimestampsPlugin = require('mongoose-timestamp');
var backend = require('beamjs').backend();
var model = backend.model();

module.exports.reqmodel = model({

    name: "reqmodel"
}, {
        requester: {

            id: Number,
            name: String
        },
        text: string,
        periority: number,
        accepted: Boolean
    }, [TimestampsPlugin]);