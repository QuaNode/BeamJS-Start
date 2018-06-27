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
        type: Number, // 2 patient - 1 Doctor - 0 admin
        code: String,
        username: String,
        first_name: String,
        last_name: String,
        mobile: String,
        email: String,
        national_id: String,
        gender: Number, // 0 Male, 1 Female
        birthday: Date,
        title: String,
        category: String,
        syndicate: String,
        Profession: String,
        medication: [{
            date: Date,
            amount: Number,
            conclusion: String,
            visit: {
                id: Number,
                doctor: {
                    id: Number,
                    name: String
                }
            },
            drug: {
                id: Number,
                name: String,
                measure: String,
                ingredient: String,
                reference: Number,

            }
        }]
    }, [TimestampsPlugin, HashedpropertyPlugin, SecretPlugin]);