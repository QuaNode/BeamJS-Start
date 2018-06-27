/*jslint node: true*/
'use strict';

var backend = require('beamjs').backend();
var behaviour = backend.behaviour();
var validator = require('email-validator');
var LogicalOperators = require('beamjs').LogicalOperators;
var ComparisonOperators = require('beamjs').ComparisonOperators;
var QueryExpression = backend.QueryExpression;
var User = require('../models/user.js').user;

module.exports.register = behaviour({

  name: 'register',
  version: '1',
  path: '/register',
  method: 'POST',
  type: 'database_with_action',
  parameters: {

    type: {
      key: 'user.type',
      type: 'body'
    },
    username: {
      key: 'user.username',
      type: 'body'
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
    gender: {
      key: 'user.gender',
      type: 'body'
    },
    birthday: {
      key: 'user.birthday',
      type: 'body'
    },
    title: {
      key: 'user.title',
      type: 'body'
    },
    category: {
      key: 'user.category',
      type: 'body'
    },
    syndicate: {
      key: 'user.syndicate',
      type: 'body'
    },
    Profession: {
      key: 'user.Profession',
      type: 'body'
    },
    medication: {
      key: 'user.medication',
      type: 'body'
    },
    password: {
      key: 'user.password',
      type: 'body'
    },
    privilege: { // doesn't exist in form
      key: 'user.privilege',
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

    if (typeof self.parameters.password !== 'string' || self.parameters.password.length < 8 || self.parameters.password.length > 20) {

      error = new Error('Invalid password');
      error.code = 400;
      return;
    }
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
        if (self.parameters.type === 0) { //admin
          userObj = {

          };
        } else if (self.parameters.type === 1) { // doctor
          userObj = {
            type: self.parameters.type,
            email: self.parameters.email,
            password: self.parameters.password,
            first_name: self.parameters.first_name,
            last_name: self.parameters.last_name,
            username: self.parameters.username,
            national_id: self.parameters.national_id,
            mobile: self.parameters.mobile,
            gender: self.parameters.gender,
            title: self.parameters.title,
            category: self.parameters.category,
            syndicate: self.parameters.syndicate,
            privilege: self.parameters.privilege || 'user1'
          }
        } else if (self.parameters.type === 2) { // patient
          userObj = {
            type: self.parameters.type,
            first_name: self.parameters.first_name,
            last_name: self.parameters.last_name,
            username: self.parameters.username,
            email: self.parameters.email,
            password: self.parameters.password,
            national_id: self.parameters.national_id,
            mobile: self.parameters.mobile,
            birthday: self.parameters.birthday,
            gender: self.parameters.gender,
            privilege: self.parameters.privilege || 'user1'
          }
        }

        operation.entity(new User()).objects(userObj).callback(function (users, e) {

          user = Array.isArray(users) && users.length === 1 && users[0];
          console.log('user', user);
          if (e) error = e;
        }).apply();
      }).begin('ModelObjectMapping', function (key, businessController, operation) {

        operation.callback(function (authUser) {

          if (user) authUser.email = user.email;
          authUser.registered = user && true;
          authUser.name = user.first_name.concat(' ', user.last_name);
          console.log('authUser', authUser);
        }).apply();
      });
  };
});
