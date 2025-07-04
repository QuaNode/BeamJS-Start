/*jslint node: true*/
'use strict';

var beam = require('beamjs');

beam.database('main', {
    type: 'mongodb',
    name: 'myapp'
}).app(__dirname + '/src/behaviours', {
    path: '/api/v1',
    parser: 'json',
    port: 8282,
    origins: '*'
});