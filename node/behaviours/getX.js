/*jslint node: true*/
'use strict';

var backend = require('beamjs').backend();
var behaviour = backend.behaviour();
var LogicalOperators = require('beamjs').LogicalOperators;
var ComparisonOperators = require('beamjs').ComparisonOperators;
var QueryExpression = backend.QueryExpression;
var X = require('../models/x.js').x;


module.exports.getx = behaviour(
  {
    name: 'getx',
    version: '1',
    path: '/getx',
    method: 'POST',
    parameters: {

      id: {
        key: 'id',
        type: 'body'
      }
    },
    returns: {

      X: {
        type: 'body'
      }
    }
  },
 function (init) {

    return function () {
      var self = init.apply(this, arguments).self();
      var x = null;
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
          .entity(new X())
          .callback(function (xArray, e) {
            
            if (e) error = e;
            if (xArray.length > 0)
              x = xArray[0];
          }).apply();
      });

      self.begin('ModelObjectMapping', function (key, businessController, operation) {

        operation.callback(function (response) {
          response.X = x;
        }).apply();
      });
    }
  });
