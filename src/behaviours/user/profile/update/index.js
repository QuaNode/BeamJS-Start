/*jslint node: true*/
'use strict';

var backend = require('beamjs').backend();
var behaviour = backend.behaviour();
var {
  FunctionalChainBehaviour
} = require('functional-chain-behaviour')();

module.exports.updateProfile = behaviour({

  name: 'updateProfile',
  inherits: FunctionalChainBehaviour,
  version: '1',
  type: 'database_with_action',
  path: '/user/profile/update',
  method: 'POST',
  parameters: {
    token: {
      key: 'X-Access-Token',
      type: 'header'
    },
    firstName: {
      key: 'firstName',
      type: 'body'
    },
    lastName: {
      key: 'lastName',
      type: 'body'
    },
    authenticated: {
      key: 'authenticated',
      type: 'middleware'
    },
    user: {
      key: 'user',
      type: 'middleware'
    }
  },
  returns: {
    updated: {
      key: 'updated',
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
    var { authenticated, user, firstName, lastName } = self.parameters;
    var error = null;
    var updated = false;

    self.catch(function (e) {
      return error || e;
    }).next().guard(function () {
      if (!authenticated) {
        error = new Error('Unauthorized access');
        error.code = 401;
        return false;
      }
      if (firstName && typeof firstName !== 'string') {
        error = new Error('First name must be a string');
        error.code = 400;
        return false;
      }
      if (lastName && typeof lastName !== 'string') {
        error = new Error('Last name must be a string');
        error.code = 400;
        return false;
      }
      return true;
    }).async(function (next, models) {
      if (error) return next();
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      models([user]).save(function (e, updatedUsers) {
        if (e) {
          error = e;
        } else if (Array.isArray(updatedUsers)) {
          var [updatedUser] = updatedUsers;
          if (updatedUser) {
            user = updatedUser;
            updated = true;
          }
        }
        next();
      });
    }).skip(function () {
      return !!error;
    }).map(function (response) {
      response.updated = updated;
      response.user = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        status: user.status
      };
    }).end();
  };
});