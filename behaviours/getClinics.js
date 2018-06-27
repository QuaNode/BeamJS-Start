/*jslint node: true*/
'use strict';

var backend = require('beamjs').backend();
var behaviour = backend.behaviour();
var LogicalOperators = require('beamjs').LogicalOperators;
var ComparisonOperators = require('beamjs').ComparisonOperators;
var QueryExpression = backend.QueryExpression;
var Clinic = require('../models/clinic.js').clinic;
var jwt = require('jsonwebtoken');


module.exports.getClinics = behaviour(
  {
    name: 'getClinics',
    version: '1',
    path: '/clinics',
    method: 'GET',
    parameters: {
      token: {
        key: 'X-Access-Token',
        type: 'header'
      },
      user: {
        key: 'user',
        type: 'middleware'
      }
    },
    returns: {

      clinics: {
        type: 'body'
      }
    }
  }
  , function (init) {

    return function () {
      var self = init.apply(this, arguments).self();
      var user_clinics = null;
      var error = null;
      self.begin('ErrorHandling', function (key, businessController, operation) {

        operation.error(function (e) {

          return error || e;
        }).apply();
      });

      self.begin('Query', function (key, businessController, operation) {
        operation.query([new QueryExpression({
          fieldName: 'doctors._id',
          comparisonOperator: ComparisonOperators.EQUAL,
          fieldValue: self.parameters.user._id
        })])
          .entity(new Clinic())
          .callback(function (clinics, e) {
            if (e) error = e;
            user_clinics = clinics;
          }).apply();
      });

      self.begin('ModelObjectMapping', function (key, businessController, operation) {

        operation.callback(function (response) {
          response.clinics = user_clinics;
        }).apply();
      });
    }
  });
