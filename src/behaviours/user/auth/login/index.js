/*jslint node: true*/
'use strict';

var jwt = require('jsonwebtoken');
var backend = require('beamjs').backend();
var behaviour = backend.behaviour();
var {
  ComparisonOperators,
  QueryExpression
} = require('beamjs');
var {
  EQUAL
} = ComparisonOperators;
var {
  FunctionalChainBehaviour
} = require('functional-chain-behaviour')();
var {
  user: User
} = require('../../../../models/user');

module.exports.login = behaviour({

  name: 'login',
  inherits: FunctionalChainBehaviour,
  version: '1',
  type: 'database',
  path: '/auth/login',
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
    success: {
      key: 'success',
      type: 'body'
    },
    'X-Access-Token': {
      key: 'token',
      type: 'header',
      purpose: ['constant', {
        as: 'parameter',
        unless: ['login', 'register']
      }]
    },
    user: {
      key: 'user',
      type: 'body'
    }
  }
}, function (init) {

  return function () {
    var self = init.apply(this, arguments).self();
    var { email, password } = self.parameters;
    var error = null;
    var success = false;
    var token = null;
    var user = null;

    self.catch(function (e) {
      return error || e;
    }).next().guard(function () {
      if (typeof email !== 'string' || email.length === 0) {
        error = new Error('Invalid email');
        error.code = 400;
        return false;
      }
      if (typeof password !== 'string' || password.length === 0) {
        error = new Error('Invalid password');
        error.code = 400;
        return false;
      }
      return true;
    }).if(function () {
      return !error && email && password;
    }).entity(new User({
      exclude: undefined
    })).query([
      new QueryExpression({
        fieldName: 'email',
        comparisonOperator: EQUAL,
        fieldValue: email
      })
    ]).then(function (users, e) {
      if (e) {
        error = e;
        return;
      }
      if (!Array.isArray(users) || users.length === 0) {
        error = new Error('Invalid email or password');
        error.code = 401;
        return;
      }
      user = users[0];
      if (!user.verifyPassword(password)) {
        error = new Error('Invalid email or password');
        error.code = 401;
        return;
      }
    }).next().async(function (next, models) {
      if (!error && user) {
        var tokenPayload = {
          jwtid: user._id,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
          aud: user.email
        };

        jwt.sign(tokenPayload, user.secret, function (signError, signedToken) {
          if (signError) {
            error = new Error('Token generation failed');
            error.code = 500;
            next();
            return;
          }
          token = signedToken;
          success = true;
          next();
        });
      } else {
        next();
      }
    }).map(function (response) {
      if (error) {
        response.success = false;
        response.error = error.message;
        response.code = error.code || 500;
      } else {
        response.success = success;
        response.token = token;
        response.user = {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        };
      }
    }).end();
  };
});