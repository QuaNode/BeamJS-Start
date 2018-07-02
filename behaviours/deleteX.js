/*jslint node: true*/
'use strict';

var backend = require('beamjs').backend();
var behaviour = backend.behaviour();
var LogicalOperators = require('beamjs').LogicalOperators;
var ComparisonOperators = require('beamjs').ComparisonOperators;
var QueryExpression = backend.QueryExpression;

var X = require('../models/x.js').x;
module.exports.deletex = behaviour({

    name: 'deletex',
    version: '1',
    path: '/deletex',
    method: 'POST',
    parameters: {

        id: {
            key: 'id',
            type: 'body'
        }
    },
    returns: {

        removed: {
            
            key: 'removed',
            type: 'body'
        }
    }

}, function (init) {
    return function () {
        var self = init.apply(this, arguments).self();
        var error = null;

        self.begin('ErrorHandling', function (key, businessController, operation) {

            businessController.modelController.save(function (er) {

                operation.error(function (e) {

                    return error || er || e;
                }).apply();
            });
        });


        if (typeof self.parameters.id !== "number" || self.parameters.id.length === 0) {

            error = new Error('x id is invalid');
            error.code = 401;
            return;
        }
        self.begin('Delete', function (key, businessController, operation) {

            operation.entity(new X()).query([new QueryExpression({

                fieldName: '_id',
                comparisonOperator: ComparisonOperators.EQUAL,
                fieldValue: self.parameters.id
            })]).callback(function (xArray, e) {
                if (e) {
                    error = e;
                    return;
                }


            }).apply();
        }).begin('ModelObjectMapping', function (key, businessController, operation) {

            operation.callback(function (response) {

                response.removed = true;
            }).apply();
        });

    }
});
