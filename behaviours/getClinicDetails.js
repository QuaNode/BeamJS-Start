/*jslint node: true*/
'use strict';

var backend = require('beamjs').backend();
var behaviour = backend.behaviour();
var LogicalOperators = require('beamjs').LogicalOperators;
var ComparisonOperators = require('beamjs').ComparisonOperators;
var QueryExpression = backend.QueryExpression;
var Clinic = require('../models/clinic.js').clinic;
var jwt = require('jsonwebtoken');


module.exports.getclinicdetails = behaviour(
  {
    name: 'getclinicdetails',
    version: '1',
    path: '/getclinicdetails',
    method: 'POST',
    parameters: {
      token: {
        key: 'X-Access-Token',
        type: 'header'
      },
      id: {
        key: 'id',
        type: "body"
      }
    },
    returns: {

      clinic: {
        type: 'body'
      }
    }
  }
  , function (init) {

    return function () {
      var self = init.apply(this, arguments).self();
      var clinic = null;
      var error = null;
      self.begin('ErrorHandling', function (key, businessController, operation) {

        operation.error(function (e) {

          return error || e;
        }).apply();
      });

      self.begin('Query', function (key, businessController, operation) {
        console.log(self.parameters);
        operation.query([new QueryExpression({
          fieldName: '_id',
          comparisonOperator: ComparisonOperators.EQUAL,
          fieldValue: self.parameters.id
        })])
          .entity(new Clinic())
          .callback(function (res_clinic, e) {
            if (e) error = e;
            if (res_clinic.length > 0)
              clinic = res_clinic[0];
          }).apply();
      });

      self.begin('ModelObjectMapping', function (key, businessController, operation) {

        operation.callback(function (response) {
          response.clinic = clinic;
          console.log(response.clinic);
        }).apply();
      });
    }
  });
