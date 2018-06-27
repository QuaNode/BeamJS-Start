/*jslint node: true*/
'use strict';

var backend = require('beamjs').backend();
var behaviour = backend.behaviour();
var LogicalOperators = require('beamjs').LogicalOperators;
var ComparisonOperators = require('beamjs').ComparisonOperators;
var QueryExpression = backend.QueryExpression;
var Clinic = require('../models/clinic.js').clinic;
module.exports.updateClinic = behaviour({

  name: 'updateClinic',
  version: '1',
  path: '/clinic/update',
  method: 'POST',
  type: 'database_with_action',
  parameters: {

    token: {
      key: 'X-Access-Token',
      type: 'header'
    },
    _id: {
      key: 'clinic._id',
      type: 'body'
    },
    name: {
      key: 'clinic.name',
      type: 'body'
    },
    working_days: {
      key: 'clinic.working_days',
      type: 'body'
    },
    hospital_clinic: {
      key: 'clinic.hospital_clinic',
      type: 'body'
    },
    location: {
      key: 'clinic.location',
      type: 'body'
    },
    hospital: {
      key: 'clinic.hospital',
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
    self.begin('ErrorHandling', function (key, businessController, operation) {

      businessController.modelController.save(function (er) {

        operation.error(function (e) {

          return error || er || e;
        }).apply();
      });
    });
    if (typeof self.parameters._id != "number" || self.parameters._id == 0) {
      error = new Error('Invalid Id');
      error.code = 400;
      return;
    }
    for (var i = 0; i < self.parameters.working_days.length; i++) {
      self.parameters.working_days[i]._id = i;
    }


    self.begin('Query', function (key, businessController, operation) {

      operation
        .query([new QueryExpression({

          fieldName: '_id',
          comparisonOperator: ComparisonOperators.EQUAL,
          fieldValue: self.parameters._id
        })])
        .entity(new Clinic())
        .callback(function (clinics, e) {

          if (e) error = e;
          if (Array.isArray(clinics) && clinics.length == 1)
            clinic = clinics[0];

          clinic.name = self.parameters.name;
          clinic.working_days = self.parameters.working_days;
          clinic.hospital_clinic = self.parameters.hospital_clinic;
          clinic.hospital = self.parameters.hospital;
          clinic.location = self.parameters.location;
          clinic.contact = self.parameters.contact;
          businessController.modelController.save(function (error) {
            if (error)
              console.log(error);
          });


        })
        .apply();
    }).begin('ModelObjectMapping', function (key, businessController, operation) {

      operation.callback(function (response) {

        response.added = clinic && true;
      }).apply();
    });
  };
});
