/*jslint node: true*/
'use strict';

var backend = require('beamjs').backend();
var behaviour = backend.behaviour();
var ComparisonOperators = require('beamjs').ComparisonOperators;
var QueryExpression = backend.QueryExpression;
var X = require('../models/x').x;

module.exports.addx = behaviour({

  name: 'addx',
  version: '1',
  path: '/addx',
  method: 'POST',
  type: 'database_with_action',
  parameters: {

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

    added: {

      key: 'added',
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

    self.begin('Insert', function (key, businessController, operation) {

        var xObject = {
          name: self.parameters.name,
          working_days: self.parameters.working_days
        }
        operation.entity(new X()).objects(xObject).callback(function (xArray, e) {

          x = Array.isArray(xArray) && xArray.length === 1 && xArray[0];
          if (e) error = e;
        }).apply();
      }).begin('ModelObjectMapping', function (key, businessController, operation) {

        operation.callback(function (response) {

          response.added = x && true;
        }).apply();
      });
  };
});
