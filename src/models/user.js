/* jslint node: true */
'use strict';

var TimestampsPlugin = require('mongoose-timestamp');
var HashedPropertyPlugin = require('mongoose-hashed-property');
var SecretPlugin = require('mongoose-secret');
var backend = require('beamjs').backend();
var model = backend.model();

module.exports.user = model({
    name: 'user',
    features: {
        exclude: ['hashed_password', 'secret']
    }
}, {
    _id: Number,
    firstName: String,
    lastName: String,
    email: String,
    mobile: String,
    status: String
}, [TimestampsPlugin, HashedPropertyPlugin, SecretPlugin]);