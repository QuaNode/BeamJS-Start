/*jslint node: true*/
'use strict';

var backend = require('beamjs').backend();
var behaviour = backend.behaviour();
var LogicalOperators = require('beamjs').LogicalOperators;
var ComparisonOperators = require('beamjs').ComparisonOperators;
var QueryExpression = backend.QueryExpression;
var X = require('../models/request.js').x;


module.exports.accept_request = behaviour({

    name: 'Accept Request',
    version: '1',
    path: '/accept_request',
    method: 'POST',
    parameters: {

        id: {
            key: 're_id',
            type: 'body'
        }
    },
    returns: {

        accept: {
            type: 'body'
        }
    }
},
function (init) {

    return function () {
        var self = init.apply(this, arguments).self();
        var accepted = null;
        var error = null;
        self.begin('ErrorHandling', function (key, businessController, operation) {

            operation.error(function (e) {

                return error || e;
            }).apply();
        });



        self.begin('Query', function (key, businessController, operation) {
            operation.query([new QueryExpression({

                fieldName: '_id',
                comparisonOperator: ComparisonOperators.EQUAL,
                fieldValue: self.parameters.id
            })])
                .entity(new req())
                .callback(function (Requests, e) {
                    if (e) error = e;
                    var request=Requests[0].accepted

                    
                }).apply();
        });

        self.begin('ModelObjectMapping', function (key, businessController, operation) {

            operation.callback(function (response) {
                response.xArray = xArray;
            }).apply();
        });
    }
});
