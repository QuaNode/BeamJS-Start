/*jslint node: true*/
'use strict';

var backend = require('beamjs').backend();
var behaviour = backend.behaviour();
var LogicalOperators = require('beamjs').LogicalOperators;
var ComparisonOperators = require('beamjs').ComparisonOperators;
var QueryExpression = backend.QueryExpression;
var User = require('../models/user.js').user;
var jwt = require('jsonwebtoken');


module.exports.getPatient = behaviour(
  {
    name: 'getPatients',
    version: '1',
    path: '/patients',
    method: 'POST',
    parameters: {
      token: {
        key: 'X-Access-Token',
        type: 'header'
      },
      user: {
        key: 'user',
        type: 'middleware'
      },
      ids: {
        key: 'ids',
        type: 'body'
      }
    },
    returns: {

      patients: {
        type: 'body'
      }
    }
  }
  , function (init) {

    return function () {
      var self = init.apply(this, arguments).self();
      var res_users = [];
      var error = null;
      var patients = [];
      self.begin('ErrorHandling', function (key, businessController, operation) {

        operation.error(function (e) {

          return error || e;
        }).apply();
      });

      self.begin('Query', function (key, businessController, operation) {
        console.log('ids', self.parameters.ids);
        operation.query([new QueryExpression({
          fieldName: '_id',
          comparisonOperator: ComparisonOperators.IN,
          fieldValue: self.parameters.ids
        })])
          .entity(new User())
          .callback(function (users, e) {
            if (e) error = e;
            res_users = users;
            console.log('uuu', res_users);
          }).apply();
      });

      self.begin('ModelObjectMapping', function (key, businessController, operation) {

        operation.callback(function (response) {

          response.patients = res_users;
          console.log('ppp', res_users);
        }).apply();
      });
    }
  });
