/*jslint node: true*/
'use strict';

var backend = require('beamjs').backend();
var behaviour = backend.behaviour();
var LogicalOperators = require('beamjs').LogicalOperators;
var ComparisonOperators = require('beamjs').ComparisonOperators;
var QueryExpression = backend.QueryExpression;
var X = require('../models/x.js').x;
module.exports.updatex = behaviour({

  name: 'updatex',
  version: '1',
  path: '/updatex',
  method: 'POST',
  type: 'database_with_action',
  parameters: {

    id: {
      key: 'id',
      type: 'body'
    },
    name: {
      key: 'name',
      type: 'body'
    },
    working_days: {
      key: 'working_days',
      type: 'body'
    }
  },
  returns: {

    updated: {

      type: 'body'
    }
  }
}, function (init) {

  return function () {

    var self = init.apply(this, arguments).self();
    var x = null;
    var error = null;
    self.begin('ErrorHandling', function (key, businessController, operation) {

      businessController.modelController.save(function (er) {

        operation.error(function (e) {

          return error || er || e;
        }).apply();
      });
    });
    if (typeof self.parameters.id !== "number" || self.parameters.id.length === 0) {
      error = new Error('Invalid Id');
      error.code = 400;
      return;
    }


    self.begin('Query', function (key, businessController, operation) {

      operation
        .query([new QueryExpression({

          fieldName: '_id',
          comparisonOperator: ComparisonOperators.EQUAL,
          fieldValue: self.parameters.id
        })])
        .entity(new X())
        .callback(function (xArray, e) {

          if (e) error = e;
          if (Array.isArray(xArray) && xArray.length == 1)
            x = xArray[0];
          if (typeof self.parameters.name !== 'undefined')
            x.name = self.parameters.name;
          if (typeof self.parameters.working_days !== 'undefined')
            x.working_days = self.parameters.working_days;

          businessController.modelController.save(function (error) {
            if (error)
              console.log(error);
          });


        })
        .apply();
    }).begin('ModelObjectMapping', function (key, businessController, operation) {

      operation.callback(function (response) {

        response.updated = x && true;
      }).apply();
    });
  };
});
