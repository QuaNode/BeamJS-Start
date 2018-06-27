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
      // if ((typeof self.parameters.username !== 'string' || self.parameters.username.length === 0) &&
      //   (typeof self.parameters.email !== 'string' || self.parameters.email.length === 0)) {

      //   error = new Error('Invalid username or email');
      //   error.code = 401;
      //   return;
      // }
      // if (typeof self.parameters.password !== 'string' || self.parameters.password.length === 0) {

      //   error = new Error('Invalid password');
      //   error.code = 401;
      //   return;
      // }
      console.log("id", self.parameters.user);
      self.begin('Query', function (key, businessController, operation) {
        operation.query([new QueryExpression({
          fieldName: '_id',
          comparisonOperator: ComparisonOperators.EQUAL,
          fieldValue: self.parameters.user._id
        })])
          .entity(new User())
          .callback(function (users, e) {
            if (e) error = e;
            console.log("users", users);
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
