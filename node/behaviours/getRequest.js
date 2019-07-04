/*jslint node: true*/
'use strict';

var backend = require('beamjs').backend();
var behaviour = backend.behaviour();
var LogicalOperators = require('beamjs').LogicalOperators;
var ComparisonOperators = require('beamjs').ComparisonOperators;
var QueryExpression = backend.QueryExpression;
var Request = require('../models/request.js').request;


module.exports.getRequest = behaviour(
    {
        name: 'getRequest',
        version: '1',
        path: '/requests',
        method: 'POST',
        parameters: {

        },
        returns: {

            requests: {
                type: 'body'
            }
        }
    },
    function (init) {

        return function () {
            var self = init.apply(this, arguments).self();
            var requests = null;
            var error = null;
            self.begin('ErrorHandling', function (key, businessController, operation) {

                operation.error(function (e) {

                    return error || e;
                }).apply();
            });

            self.begin('Query', function (key, businessController, operation) {

                operation.query()
                    .entity(new Request())
                    .callback(function (xArray, e) {

                        if (e) error = e;
                        if (xArray.length > 0) requests = xArray;
                    }).apply();
            });

            self.begin('ModelObjectMapping', function (key, businessController, operation) {

                operation.callback(function (response) {
                    response.requests = requests;
                }).apply();
            });
        }
    });
