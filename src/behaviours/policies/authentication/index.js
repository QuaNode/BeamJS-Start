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
} = require('../../../models/user');

module.exports.authenticate = behaviour({

  name: 'authenticate',
  inherits: FunctionalChainBehaviour,
  version: '1',
  type: 'database',
  path: '/',
  parameters: {
    token: {
      key: 'X-Access-Token',
      type: 'header'
    }
  },
  returns: {
    authenticated: {
      type: 'middleware'
    },
    user: {
      type: 'middleware'
    }
  },
  unless: ['login', 'register']
}, function (init) {

  return function () {
    var self = init.apply(this, arguments).self();
    var { token } = self.parameters;
    var error = null;
    var user = null;
    var authenticated = false;
    var decoded = jwt.decode(token);

    self.catch(function (e) {
      return error || e;
    }).next().guard(function () {
      if (!token) {
        error = new Error('Access token is required');
        error.code = 401;
        return false;
      }
      if (!decoded) {
        error = new Error('Invalid token format');
        error.code = 401;
        return false;
      }
      return true;
    }).if(function () {
      return !error && decoded && decoded.jwtid;
    }).entity(new User({
      exclude: undefined
    })).query([
      new QueryExpression({
        fieldName: '_id',
        comparisonOperator: EQUAL,
        fieldValue: decoded.jwtid
      })
    ]).then(function (users, e) {
      if (e) {
        error = e;
        return;
      }
      if (!Array.isArray(users) || users.length === 0) {
        error = new Error('User not found');
        error.code = 401;
        return;
      }
      user = users[0];
    }).next().async(function (next) {
      if (!error && user) {
        jwt.verify(token, user.secret, {
          audience: user.email
        }, function (verifyError) {
          if (verifyError) {
            error = new Error('Token verification failed');
            error.code = 401;
          } else {
            authenticated = true;
          }
          next();
        });
      } else {
        next();
      }
    }).map(function (response) {
      response.authenticated = authenticated;
      response.user = user;
    }).end();
  };
});