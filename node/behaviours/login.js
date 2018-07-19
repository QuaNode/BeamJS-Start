/*jslint node: true*/
'use strict';

var backend = require('beamjs').backend();
var behaviour = backend.behaviour();
var LogicalOperators = require('beamjs').LogicalOperators;
var ComparisonOperators = require('beamjs').ComparisonOperators;
var QueryExpression = backend.QueryExpression;
var User = require('../models/user.js').user;
var jwt = require('jsonwebtoken');

var genToken = function (user, ip) {

  var expires = expiresIn(365 * 2); // 365 * 2 days
  var token = jwt.sign({

    exp: expires * 24 * 60 * 60,
    jwtid: user._id
  }, user.secret, {

      audience: user.email + '/' + ip
    });
  return token;
};

var expiresIn = function (numDays) {

  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
};

module.exports.login = behaviour({

  name: 'login',
  version: '1',
  path: '/login',
  method: 'POST',
  parameters: {

    email: {

      key: 'email',
      type: 'body'
    },
    password: {

      key: 'password',
      type: 'body'
    }
  },
  returns: {

    email: {

      type: 'body'
    },
    name: {

      type: 'body'
    },
    authenticated: {

      type: 'body'
    },
    id: {

      type: 'body'
    },
    'X-Access-Token': {

      key: 'token',
      type: 'body',
      purpose: ['constant', {

        as: 'parameter',
        unless: ['login', 'register']
      }]
    }
  }
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
    if (typeof self.parameters.email !== 'string' || self.parameters.email.length === 0) {

      error = new Error('Invalid email');
      error.code = 401;
      return;
    }
    if (typeof self.parameters.password !== 'string' || self.parameters.password.length === 0) {

      error = new Error('Invalid password');
      error.code = 401;
      return;
    }
    self.begin('Query', function (key, businessController, operation) {

      operation.entity(new User()).query([new QueryExpression({

        fieldName: 'email',
        comparisonOperator: ComparisonOperators.EQUAL,
        fieldValue: self.parameters.email
      })]).callback(function (users, e) {

        user = Array.isArray(users) && users.length === 1 && users[0];
        error = e;
      }).apply();
    }).begin('ModelObjectMapping', function (key, businessController, operation) {

      operation.callback(function (authUser) {

        if (user) {
          authUser.email = user.email;
          authUser.id = user._id;
          authUser.name = user.first_name.concat(' ', user.last_name);
        }
        authUser.authenticated = !user && 'wrong email' || user.verifyPassword(self.parameters.password) || 'wrong password';
        if (user) authUser.token = genToken(user, self.parameters.ip);
      }).apply();
    });
  };
});
