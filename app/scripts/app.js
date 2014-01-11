'use strict';

angular.module('zupPainelApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/login.html',
        controller: 'MainCtrl'
      })
      .when('/groups', {
        templateUrl: 'views/groups/index.html',
        controller: 'GroupCtrl'
      })
      .when('/groups/:id', {
        templateUrl: 'views/groups/list.html',
        controller: 'GroupCtrl'
      })
      .when('/users', {
        templateUrl: 'views/users/index.html',
        controller: 'UsersCtrl'
      })
      .when('/reports', {
        templateUrl: 'views/reports/index.html',
        controller: 'ReportsCtrl'
      })
      .when('/reports/:id', {
        templateUrl: 'views/reports/list.html',
        controller: 'ReportsCtrl'
      })
      .when('/inventories', {
        templateUrl: 'views/inventories/index.html',
        controller: 'InventoriesCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    // Not supported in github :-(
    //$locationProvider.html5Mode(true);
  });
