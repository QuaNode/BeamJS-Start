/*jslint node: true*/
'use strict';

var TimestampsPlugin = require('mongoose-timestamp');
var HashedpropertyPlugin = require('mongoose-hashed-property');
var SecretPlugin = require('mongoose-secret');
var backend = require('beamjs').backend();
var model = backend.model();

module.exports.user = model({

    name: "user"
}, {
        id: Number,
        first_name: String,
        last_name: String,
        mobile: String,
        email: String
        
    }, [TimestampsPlugin, HashedpropertyPlugin, SecretPlugin]);