/*jslint node: true*/
'use strict';

var backend = require('beamjs').backend();
var behaviour = backend.behaviour();
var {
  FunctionalChainBehaviour
} = require('functional-chain-behaviour')();

module.exports.logout = behaviour({

  name: 'logout',
  inherits: FunctionalChainBehaviour,
  version: '1',
  type: 'database_with_action',
  path: '/auth/logout',
  method: 'POST',
  parameters: {
    token: {
      key: 'X-Access-Token',
      type: 'header'
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
    success: {
      key: 'success',
      type: 'body'
    }
  }
}, function (init) {

  return function () {
    var self = init.apply(this, arguments).self();
    var { authenticated, user } = self.parameters;
    var error = null;
    var success = false;

    self.catch(function (e) {
      return error || e;
    }).next().guard(function () {
      if (!authenticated) {
        error = new Error('Unauthorized access');
        error.code = 401;
        return false;
      }
      return true;
    }).async(function (next) {
      var secret = user.secret;
      user.generateNewSecret(function (e) {
        if (e) {
          error = e;
        } else {
          success = user.secret !== secret;
        }
        next();
      });
    }).skip(function () {
      return !!error;
    }).map(function (response) {
      response.success = success;
    }).end();
  };
});