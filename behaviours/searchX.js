/*jslint node: true*/
'use strict';

var backend = require('beamjs').backend();
var behaviour = backend.behaviour();
var LogicalOperators = require('beamjs').LogicalOperators;
var ComparisonOperators = require('beamjs').ComparisonOperators;
var QueryExpression = backend.QueryExpression;
var X = require('../models/x.js').x;


module.exports.searchx = behaviour({

    name: 'searchx',
    version: '1',
    path: '/searchx',
    method: 'GET',
    parameters: {

        name: {
            key: 'name',
            type: 'body'
        }
    },
    returns: {

        xArray: {
            type: 'body'
        }
    }
},
function (init) {

    return function () {
        var self = init.apply(this, arguments).self();
        var xArray = null;
        var error = null;
        self.begin('ErrorHandling', function (key, businessController, operation) {

            operation.error(function (e) {

                return error || e;
            }).apply();
        });

        self.begin('Query', function (key, businessController, operation) {
            operation.query([new QueryExpression({

                fieldName: 'name',
                comparisonOperator: ComparisonOperators.EQUAL,
                fieldValue: self.parameters.name
            })])
                .entity(new X())
                .callback(function (_xArray, e) {
                    if (e) error = e;

                    xArray = _xArray;
                }).apply();
        });

        self.begin('ModelObjectMapping', function (key, businessController, operation) {

            operation.callback(function (response) {
                response.xArray = xArray;
            }).apply();
        });
    }
});
