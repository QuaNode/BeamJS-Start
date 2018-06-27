/*jslint node: true*/
'use strict';

var backend = require('beamjs').backend();
var behaviour = backend.behaviour();
var LogicalOperators = require('beamjs').LogicalOperators;
var ComparisonOperators = require('beamjs').ComparisonOperators;
var QueryExpression = backend.QueryExpression;
var User = require('../models/user.js').user;
var jwt = require('jsonwebtoken');

module.exports.logout = behaviour({

  name: 'logout',
  version: '1',
  path: '/logout',
  method: 'POST',
  parameters: {

    user: {

      key: 'user',
      type: 'middleware'
    },
    token: {

      key: 'X-Access-Token',
      type: 'header'
    }
  },
  returns: {

    email: {

      type: 'body'
    },
    unauthenticated: {

      type: 'body'
    }
  }
}, function (init) {

  return function () {

    var self = init.apply(this, arguments).self();
    var user = self.parameters.user;
    var error = null;
    var secret = null;
    self.begin('ErrorHandling', function (key, businessController, operation) {

      businessController.modelController.save(function (er) {

        operation.error(function (e) {

          return error || er || e;
        }).apply();
      });
    });
    self.use(function (key, businessController, next) {

      if (user) {

        secret = user.secret;
        user.generateNewSecret(function (e) {

          if (e) error = error;
          next();
        });
      } else next();
    }).begin(function (key, businessController, operation) {

      operation.callback(function (authUser) {

        if (user) authUser.email = user.email;
        authUser.unauthenticated = (user && user.secret !== secret) || 'Logout failed';
      }).apply();
    }).when('ModelObjectMapping');
  };
});
