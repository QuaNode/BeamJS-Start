/*jslint node: true*/
'use strict';

var backend = require('beamjs').backend();
var behaviour = backend.behaviour();
var LogicalOperators = require('beamjs').LogicalOperators;
var ComparisonOperators = require('beamjs').ComparisonOperators;
var QueryExpression = backend.QueryExpression;
var User = require('../models/user.js').user;
var jwt = require('jsonwebtoken');


module.exports.getUser = behaviour(
  {
    name: 'getUser',
    version: '1',
    path: '/userinfo',
    method: 'POST',
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

      user: {
        type: 'body'
      }
    }
  }
  , function (init) {

    return function () {
      var self = init.apply(this, arguments).self();
      var res_user = null;
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
          fieldValue: self.parameters.user._id
        })])
          .entity(new User())
          .callback(function (users, e) {
            
            if (e) error = e;
            if (users.length > 0)
              res_user = users[0];
          }).apply();
      });

      self.begin('ModelObjectMapping', function (key, businessController, operation) {

        operation.callback(function (response) {
          response.user = res_user;
        }).apply();
      });
    }
  });
