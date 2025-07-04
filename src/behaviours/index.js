/*jslint node: true*/
'use strict';

// Authentication Policy (always first)
require('./policies/authentication');

// Auth Routes
require('./user/auth/login');
require('./user/auth/register');
require('./user/auth/logout');

// User Routes
require('./user/profile/get');
require('./user/profile/update');