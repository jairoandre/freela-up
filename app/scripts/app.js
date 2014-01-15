'use strict';

angular.module('zupPainelApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap'
])
  .config(function ($routeProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/login.html',
        controller: 'MainCtrl'
      })
      .when('/groups', {
        templateUrl: 'views/groups/index.html',
        controller: 'GroupCtrl'
      })
      .when('/groups/add', {
        templateUrl: 'views/groups/add.html',
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
      .when('/users/add', {
        templateUrl: 'views/users/add.html',
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
      .when('/reports/:id/:id', {
        templateUrl: 'views/reports/view.html',
        controller: 'ReportsCtrl'
      })
      .when('/inventories', {
        templateUrl: 'views/inventories/index.html',
        controller: 'InventoriesCtrl'
      })
      .when('/inventories/edit/:id', {
        templateUrl: 'views/inventories/edit.html',
        controller: 'InventoriesCtrl'
      })
      .when('/items', {
        templateUrl: 'views/items/index.html',
        controller: 'ItemsCtrl'
      })
      .when('/items/map', {
        templateUrl: 'views/items/map.html',
        controller: 'ItemsCtrl'
      })
      .when('/items/search', {
        templateUrl: 'views/items/search.html',
        controller: 'ItemsCtrl'
      })
      .when('/items/:id', {
        templateUrl: 'views/items/view.html',
        controller: 'ItemsCtrl'
      })
      .when('/tags', {
        templateUrl: 'views/tags/index.html',
        controller: 'TagsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    // Not supported in github :-(
    //$locationProvider.html5Mode(true);

    // register the interceptor via an anonymous factory
    $httpProvider.interceptors.push(function($q) {
      return {
        // change URL on external requests
        'request': function(config) {
          config.url = config.url.replace('{base_url}', 'http://staging.zup.sapience.io');

          return config || $q.when(config);
        }
      };
    });

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  });
