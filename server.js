/*jslint node: true*/
'use strict';

var beam = require('beamjs');

// process.env.MONGODB_URI = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL;

beam.backend(beam.database('mongodb', undefined, 'smartdoctors')).app(__dirname + '/behaviours', {

    path: '/api/v1',
    parser: 'json',
    port: 8383,
    origins: '*'
});
