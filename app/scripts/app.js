'use strict';

angular.module('zupPainelApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap'
])

.config(function ($routeProvider, $httpProvider) {

  // Configure each route
  $routeProvider
    .when('/', {
      templateUrl: 'views/login.html',
      controller: 'MainCtrl'
    })
    .when('/groups', {
      templateUrl: 'views/groups/index.html',
      controller: 'GroupsCtrl',
      access: {
        logged: true
      }
    })
    .when('/groups/add', {
      templateUrl: 'views/groups/add.html',
      controller: 'GroupsCtrl',
      access: {
        logged: true
      }
    })
    .when('/groups/:id', {
      templateUrl: 'views/groups/list.html',
      controller: 'ViewGroupsCtrl',
      access: {
        logged: true
      }
    })
    .when('/users', {
      templateUrl: 'views/users/index.html',
      controller: 'UsersCtrl',
      access: {
        logged: true
      }
    })
    .when('/users/:id', {
      templateUrl: 'views/users/view.html',
      controller: 'UsersCtrl',
      access: {
        logged: true
      }
    })
    .when('/users/add', {
      templateUrl: 'views/users/add.html',
      controller: 'UserCtrl',
      access: {
        logged: true
      }
    })
    .when('/reports', {
      templateUrl: 'views/reports/index.html',
      controller: 'ReportsCtrl',
      access: {
        logged: true
      }
    })
    .when('/reports/:categoryId', {
      templateUrl: 'views/reports/list.html',
      controller: 'ViewItemsReportsCtrl',
      access: {
        logged: true
      }
    })
    .when('/reports/:categoryId/:id', {
      templateUrl: 'views/reports/view.html',
      controller: 'ReportsCtrl',
      access: {
        logged: true
      }
    })
    .when('/inventories', {
      templateUrl: 'views/inventories/index.html',
      controller: 'InventoriesCtrl',
      access: {
        logged: true
      }
    })
    .when('/inventories/edit/:id', {
      templateUrl: 'views/inventories/edit.html',
      controller: 'InventoriesCtrl',
      access: {
        logged: true
      }
    })
    .when('/items', {
      templateUrl: 'views/items/index.html',
      controller: 'ItemsCtrl',
      access: {
        logged: true
      }
    })
    .when('/items/map', {
      templateUrl: 'views/items/map.html',
      controller: 'ItemsCtrl',
      access: {
        logged: true
      }
    })
    .when('/items/search', {
      templateUrl: 'views/items/search.html',
      controller: 'ItemsCtrl',
      access: {
        logged: true
      }
    })
    .when('/items/:id', {
      templateUrl: 'views/items/view.html',
      controller: 'ItemsCtrl',
      access: {
        logged: true
      }
    })
    .when('/tags', {
      templateUrl: 'views/tags/index.html',
      controller: 'TagsCtrl',
      access: {
        logged: true
      }
    })
    .otherwise({
      redirectTo: '/'
    });

  // Not supported in github :-(
  //$locationProvider.html5Mode(true);

  // register the interceptor via an anonymous factory
  $httpProvider.interceptors.push(['$q', '$injector', function($q, $injector) {
    return {
      // change URL on external requests
      'request': function(config) {
        // temparary fix -- replace with http://staging.zup.sapience.io later
        config.url = config.url.replace('{base_url}', 'http://staging.zup.sapience.io');

        // get token and pass to the server with header X-App-Token
        var token = null;

        $injector.invoke(['Auth', function(Auth) {
          token = Auth.getToken();
        }]);

        config.headers['X-App-Token'] = token;

        // apply all the changes! :)
        return config || $q.when(config);
      }
    };
  }]);

  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
})

.run(['$rootScope', '$location', 'Auth', function($rootScope, $location, Auth) {

  $rootScope.$on('$routeChangeStart', function(e, curr, prev) {

    if (typeof prev === 'undefined')
    {
      $rootScope.isLoading = true;
    }

    /*
    User checklist

    1) Check if route needs authentication
      1.1) If yes, check if cookie with token exists
        1.1.1) If cookie exists, check user data with token
        1.1.2) If okay, stop loading
      1.2) If cookie doesn't exists, redirect to login page
    */

    // Check if route needs authentication
    if (typeof curr.access !== 'undefined' && curr.access.logged === true)
    {
      // Check if user has a cookie with token
      var check = Auth.check();

      check.then(function() {
        // onSuccess
        $rootScope.isLoading = false;
      }, function() {
        // onError, redirect to login
        $rootScope.isLoading = false;

        $location.path('/');
      });
    }
    else
    {
      $rootScope.isLoading = false;
    }

  });
}]);
