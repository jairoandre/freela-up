'use strict';

angular
  .module('zupPainelApp', [
    // external modules
    'ui.router',
    'restangular',
    'ngCookies',
    'ngAnimate',
    'ngSanitize',
    'ui.bootstrap',
    'ui.autocomplete',
    'ui.select2', // old version MOTHAFU#@
    'ui.select',
    'ui.mask',
    'infinite-scroll',
    'angularFileUpload',
    'colorpicker.module',
    'frapontillo.bootstrap-switch',
    'ngStorage',

    // Core services
    'AuthServiceModule',
    'UserServiceModule',
    'FullResponseRestangularServiceModule',

    // Core components
    'NavItemComponentModule',
    'DetectScrollTopComponentModule',

    // Constants
    'config',

    // Routes
    'IndexModule',
    'UserModule',
    'ReportsModule',
    'ItemsModule',
    'ConfigModule',
    'UsersModule',
    'GroupsModule'
  ]);
