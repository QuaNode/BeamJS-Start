/*jslint node: true*/
'use strict';

var backend = require('beamjs').backend();
var behaviour = backend.behaviour();
var X = require('../models/x').x;

module.exports.addx = behaviour({

  name: 'addx',
  version: '1',
  path: '/addx',
  method: 'POST',
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
    var added = null;
    var error = null;
    self.begin('ErrorHandling', function (key, businessController, operation) {

      businessController.modelController.save(function (er) {

        operation.error(function (e) {

          return error || er || e;
        }).apply();
      });
    });
    if (Array.isArray(self.parameters.working_days) && self.parameters.working_days.length === 0) {

      error = new Error('working days array is empty!!');
      error.code = 400;
      return;
    }
    if (typeof self.parameters.name !== 'string' || self.parameters.name.length === 0) {

      error = new Error('Invalid name');
      error.code = 400;
      return;
    }
    self.begin('Insert', function (key, businessController, operation) {

      operation.entity(new X()).objects(self.parameters).callback(function (xArray, e) {

        if (e) error = e;
        else added = true;
      }).apply();
    }).begin('ModelObjectMapping', function (key, businessController, operation) {

      operation.callback(function (response) {

        response.added = added;
      }).apply();
    });
  };
});
