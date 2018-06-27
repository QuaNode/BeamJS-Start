/*jslint node: true*/
'use strict';

var backend = require('beamjs').backend();
var behaviour = backend.behaviour();
var LogicalOperators = require('beamjs').LogicalOperators;
var ComparisonOperators = require('beamjs').ComparisonOperators;
var QueryExpression = backend.QueryExpression;
var Clinic = require('../models/clinic.js').clinic;
var User = require('../models/user.js').user;
module.exports.addClinic = behaviour({

  name: 'addClinic',
  version: '1',
  path: '/clinic/add',
  method: 'POST',
  type: 'database_with_action',
  parameters: {

    token: {
      key: 'X-Access-Token',
      type: 'header'
    },
    name: {
      key: 'clinic.name',
      type: 'body'
    },
    working_days: {
      key: 'clinic.working_days',
      type: 'body'
    },
    location: {
      key: 'clinic.location',
      type: 'body'
    },
    contact: {
      key: 'clinic.contact',
      type: 'body'
    },
    doctor: {
      key: 'clinic.doctor',
      type: 'body'
    },
    user: {
      key: 'user',
      type: 'middleware'
    }
  },
  returns: {

    added: {

      type: 'body'
    }
  }
}, function (init) {

  return function () {

    var self = init.apply(this, arguments).self();
    var clinic = null;
    var error = null;
    var user = null;
    self.begin('ErrorHandling', function (key, businessController, operation) {

      businessController.modelController.save(function (er) {

        operation.error(function (e) {

          return error || er || e;
        }).apply();
      });
    });
    // if (typeof self.parameters.category !== 'string' || self.parameters.category.length === 0 ) {

    //   error = new Error('Invalid category');
    //   error.code = 400;
    //   return;
    // }
    for (var i = 0; i < self.parameters.working_days.length; i++) {
      self.parameters.working_days[i]._id = i;
    }


    self.begin('Query', function (key, businessController, operation) {

      operation
        .query([new QueryExpression({

          fieldName: 'email',
          comparisonOperator: ComparisonOperators.EQUAL,
          fieldValue: self.parameters.doctor.email
        })])
        .entity(new User())
        .callback(function (users, e) {

          if (e) error = e;
          user = Array.isArray(users) && users[0];
        })
        .apply();
    })
      .if(function () {

        if (!user) {

          error = new Error('User Not Found');
        }
        return user && !error && true;
      })
      .begin('Insert', function (key, businessController, operation) {
        self.c_doctors = [];
        self.parameters.doctor = { "_id": user._id, "name": self.parameters.doctor.name };
        self.c_doctors.push(self.parameters.doctor);
        var clinicObj = {
          name: self.parameters.name,
          working_days: self.parameters.working_days,
          doctors: self.c_doctors,
          location: self.parameters.location,
          contact: self.parameters.contact
        }
        operation.entity(new Clinic()).objects(clinicObj).callback(function (clinics, e) {

          clinic = Array.isArray(clinics) && clinics.length === 1 && clinics[0];
          if (e) error = e;
        }).apply();
      }).begin('ModelObjectMapping', function (key, businessController, operation) {

        operation.callback(function (response) {

          response.added = clinic && true;
        }).apply();
      });
  };
});
