/*jslint node: true*/
'use strict';

var backend = require('beamjs').backend();
var behaviour = backend.behaviour();
var ComparisonOperators = require('beamjs').ComparisonOperators;
var QueryExpression = backend.QueryExpression;
var X = require('../models/x').x;

module.exports.addx = behaviour({

  name: 'addreq',
  version: '2',
  path: '/addreq',
  method: 'POST',
  type: 'database_with_action',
  parameters: {

    name: {
      key: 'name',
      type: 'body'
    },
    text: {
      key: 'text',
      type: 'body'
    },
    periority: {
      key: 'number',
      type: 'body'
    },
    requester_id: {
      key: 'id',
      type: 'body'
    },
    requester_name: {
        key: 'name',
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


    /*if (Array.isArray(self.parameters.working_days) && self.parameters.working_days.length === 0) {

      error = new Error('working days array is empty!!');
      error.code = 401;
      return;
    }
*/
    self.begin('ErrorHandling', function (key, businessController, operation) {

      businessController.modelController.save(function (er) {

        operation.error(function (e) {

          return error || er || e;
        }).apply();
      });
    });

    self.begin('Insert', function (key, businessController, operation) {

      /*var working_days = [];
      for(var i=0 ; i< self.parameters.working_days.length ; i++) {

        working_days.push({

          _id:  (new Date()).getMilliseconds(),
          day: self.parameters.working_days[i].day,
          from: self.parameters.working_days[i].from,
          to: self.parameters.working_days[i].to
        })
      } */
      var reqmodelobject = {
        name: self.parameters.name,
        id:self.parameters.id,
        text:self.parameters.text,
        periority:self.parameters.periority,

        //working_days: working_days
      }
      operation.entity(new reqmodel()).objects(reqmodelobject).callback(function (xArray, e) {

        x = Array.isArray(xArray) && xArray.length === 1 && xArray[0];
        if (e) error = e;
      }).apply();
    }).begin('ModelObjectMapping', function (key, businessController, operation) {

      operation.callback(function (response) {

        response.added = reqmodel&& true;
      }).apply();
    });
  };
});