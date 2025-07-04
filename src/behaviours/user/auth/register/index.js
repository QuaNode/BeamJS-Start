/*jslint node: true*/
'use strict';

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

module.exports.register = behaviour({

  name: 'register',
  inherits: FunctionalChainBehaviour,
  version: '1',
  type: 'database_with_action',
  path: '/auth/register',
  method: 'POST',
  parameters: {
    firstName: {
      key: 'firstName',
      type: 'body'
    },
    lastName: {
      key: 'lastName',
      type: 'body'
    },
    email: {
      key: 'email',
      type: 'body'
    },
    mobile: {
      key: 'mobile',
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
    user: {
      key: 'user',
      type: 'body'
    }
  }
}, function (init) {

  return function () {
    var self = init.apply(this, arguments).self();
    var { firstName, lastName, email, mobile, password } = self.parameters;
    var error = null;
    var success = false;
    var user = null;

    self.catch(function (e) {
      return error || e;
    }).next().guard(function () {
      if (typeof firstName !== 'string' || firstName.length === 0) {
        error = new Error('First name is required');
        error.code = 400;
        return false;
      }
      if (typeof lastName !== 'string' || lastName.length === 0) {
        error = new Error('Last name is required');
        error.code = 400;
        return false;
      }
      if (typeof email !== 'string' || !email.includes('@')) {
        error = new Error('Valid email is required');
        error.code = 400;
        return false;
      }
      if (typeof password !== 'string' || password.length < 6) {
        error = new Error('Password must be at least 6 characters');
        error.code = 400;
        return false;
      }
      return true;
    }).if(function () {
      return !error && email;
    }).entity(new User({
      readonly: true
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
      if (Array.isArray(users) && users.length > 0) {
        error = new Error('Email already registered');
        error.code = 409;
        return;
      }
    }).next().if(function () {
      return !error;
    }).entity(new User()).insert(() => ({
      _id: new Date().getTime(),
      firstName: firstName,
      lastName: lastName,
      email: email,
      mobile: mobile || '',
      password: password,
      status: 'active'
    })).then(function (users, e) {
      if (e) {
        error = e;
        return;
      }
      if (Array.isArray(users) && users.length > 0) {
        user = users[0];
        success = true;
      } else {
        error = new Error('Failed to create user');
        error.code = 500;
      }
    }).next().async(function (next, models) {
      if (!error && user) {
        models([user]).save(function (e, savedUsers) {
          if (e) {
            error = e;
            success = false;
          } else {
            user = Array.isArray(savedUsers) && savedUsers[0];
          }
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