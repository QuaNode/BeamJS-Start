/*jslint node: true*/
'use strict';

var backend = require('beamjs').backend();
var behaviour = backend.behaviour();
var {
  FunctionalChainBehaviour
} = require('functional-chain-behaviour')();

module.exports.getProfile = behaviour({

  name: 'getProfile',
  inherits: FunctionalChainBehaviour,
  version: '1',
  type: 'database',
  path: '/user/profile',
  method: 'GET',
  parameters: {
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
    user: {
      key: 'user',
      type: 'body'
    }
  }
}, function (init) {

  return function () {
    var self = init.apply(this, arguments).self();
    var { authenticated, user } = self.parameters;
    var error = null;

    self.catch(function (e) {
      return error || e;
    }).next().guard(function () {
      if (!authenticated) {
        error = new Error('Unauthorized access');
        error.code = 401;
        return false;
      }
      return true;
    }).map(function (response) {
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