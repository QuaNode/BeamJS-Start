/*jslint node: true*/
'use strict';

var backend = require('beamjs').backend();
var behaviour = backend.behaviour();
var validator = require('email-validator');
var LogicalOperators = require('beamjs').LogicalOperators;
var ComparisonOperators = require('beamjs').ComparisonOperators;
var QueryExpression = backend.QueryExpression;
var User = require('../models/user.js').user;

module.exports.addPatient = behaviour({

  name: 'addPatient',
  version: '1',
  path: '/addnewpatient',
  method: 'POST',
  type: 'database_with_action',
  parameters: {
    token: {
      key: 'X-Access-Token',
      type: 'header'
    },
    first_name: {
      key: 'user.first_name',
      type: 'body'
    },
    last_name: {
      key: 'user.last_name',
      type: 'body'
    },
    mobile: {
      key: 'user.mobile',
      type: 'body'
    },
    email: {
      key: 'user.email',
      type: 'body'
    },
    national_id: {
      key: 'user.national_id',
      type: 'body'
    },
    birthday: {
      key: 'user.birthday',
      type: 'body'
    }
  },
  returns: {
    id: {
      type: 'body'
    },

    email: {

      type: 'body'
    },
    name: {

      type: 'body'
    },
    registered: {

      type: 'body'
    }
  }
}, function (init) {

  return function () {

    var self = init.apply(this, arguments).self();
    var user = null;
    var error = null;
    self.begin('ErrorHandling', function (key, businessController, operation) {

      businessController.modelController.save(function (er) {

        operation.error(function (e) {

          return error || er || e;
        }).apply();
      });
    });


    self.begin('Query', function (key, businessController, operation) {
      operation
        .query([new QueryExpression({

          fieldName: 'email',
          comparisonOperator: ComparisonOperators.EQUAL,
          fieldValue: self.parameters.email
        })])
        .entity(new User())
        .callback(function (users, e) {

          if (e) error = e;
          user = Array.isArray(users) && users[0];
        })
        .apply();
    })
      .if(function () {

        if (user) {

          error = new Error('User existed');
        }
        return !user && !error && true;
      }).begin('Insert', function (key, businessController, operation) {

        var userObj = {};

        userObj = {
          type: 2,  //patient
          code: new Date().getTime(),
          first_name: self.parameters.first_name,
          last_name: self.parameters.last_name,
          email: self.parameters.email,
          national_id: self.parameters.national_id,
          mobile: self.parameters.mobile,
          birthday: self.parameters.birthday,
          privilege: 'user1'
        }

        operation.entity(new User()).objects(userObj).callback(function (users, e) {

          user = Array.isArray(users) && users.length === 1 && users[0];
          if (e) error = e;
        }).apply();
      }).begin('ModelObjectMapping', function (key, businessController, operation) {

        operation.callback(function (authUser) {

          if (user) authUser.email = user.email;
          authUser.registered = user && true;
          authUser.name = user.first_name.concat(' ', user.last_name);
          authUser.id = user._id;
          console.log('authUser', authUser);
        }).apply();
      });
  };
});
