'use strict';

angular
  .module('zupPainelApp', [
    // external modules
    'ui.router',
    'restangular',
    'ngCookies',
    'ngAnimate',
    'ngSanitize',
    'angularMoment',
    'ui.bootstrap',
    'ui.autocomplete',
    'ui.select2', // old version
    'ui.select',
    'ui.mask',
    'infinite-scroll',
    'angularFileUpload',
    'colorpicker.module',
    'frapontillo.bootstrap-switch',
    'ngStorage',
    'ngRaven',
    'monospaced.elastic',
    'angularPromiseButtons',
    'ui.sortable',
    'dibari.angular-ellipsis',

    // Core services
    'AuthServiceModule',
    'UserServiceModule',
    'FullResponseRestangularServiceModule',
    'ErrorServiceModule',
    'ConfirmDialogDirectiveModule',

    // Core components
    'NavItemComponentModule',
    'DetectScrollTopComponentModule',
    'ZupTranscludeComponentModule',

    // Constants
    'config',

    // Routes
    'IndexModule',
    'UserModule',
    'ReportsModule',
    'ItemsModule',
    'ConfigModule',
    'UsersModule',
    'GroupsModule',
    'HelpModule',
    'FlowsModule',
    'CasesModule',
    'BusinessReportsModule'
  ]);
