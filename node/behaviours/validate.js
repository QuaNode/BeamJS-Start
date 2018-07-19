/*jslint node: true*/
'use strict';

var backend = require('beamjs').backend();
var behaviour = backend.behaviour();
var LogicalOperators = require('beamjs').LogicalOperators;
var ComparisonOperators = require('beamjs').ComparisonOperators;
var QueryExpression = backend.QueryExpression;
var User = require('../models/user.js').user;
var jwt = require('jsonwebtoken');

module.exports.validate = behaviour({

  name: 'validate',
  version: '1',
  path: '/',
  parameters: {

    token: {

      key: 'X-Access-Token',
      type: 'header'
    },
    ip: {

      key: 'ip',
      type: 'middleware'
    }
  },
  returns: {

    user: {

      key: 'user',
      type: 'middleware'
    }
  },
  unless: ['login', 'register', 'addx', 'updatex', 'getx', 'deletex', 'searchx']
}, function (init) {

  return function () {

    var self = init.apply(this, arguments).self();
    var user = null;
    var error = null;
    self.begin('ErrorHandling', function (key, businessController, operation) {

      operation.error(function (e) {

        return error || e;
      }).apply();
    });
    console.log('params', self.parameters);
    if (!self.parameters.token) {

      error = new Error('Access token is required');
      error.code = 401;
      return;
    }
    var decoded = jwt.decode(self.parameters.token);
    if (!decoded) {

      error = new Error('Invalid token');
      error.code = 401;
      return;
    }
    self.begin('Query', function (key, businessController, operation) {

      operation.entity(new User()).query([new QueryExpression({

        fieldName: '_id',
        comparisonOperator: ComparisonOperators.EQUAL,
        fieldValue: decoded.jwtid
      })]).callback(function (users, e) {

        user = Array.isArray(users) && users.length === 1 && users[0];
        error = e;
      }).apply();
    }).use(function (key, businessController, next) {

      if (user) {

        jwt.verify(self.parameters.token, user.secret, {

          audience: user.email + '/' + self.parameters.ip
        }, function (e) {

          if (e) {

            error = e;
            error.code = 401;
          }
          next();
        });
      } else next();
    }).begin(function (key, businessController, operation) {

      operation.callback(function (authUser) {

        if (user) authUser.user = user;
        else {

          error = new Error('Invalid token');
          error.code = 401;
        }
      }).apply();
    }).when('ModelObjectMapping');
  };
});
