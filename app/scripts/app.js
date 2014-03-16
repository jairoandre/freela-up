'use strict';

angular.module('zupPainelApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
  'restangular',
  'infinite-scroll'
])

.config(function ($routeProvider, $httpProvider, RestangularProvider) {

  // Configure each route
  $routeProvider
    .when('/', {
      templateUrl: 'views/login.html',
      controller: 'MainCtrl'
    })
    // groups
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
    // users
    .when('/users', {
      templateUrl: 'views/users/index.html',
      controller: 'UsersCtrl',
      access: {
        logged: true
      }
    })
    .when('/users/group/:groupId', {
      templateUrl: 'views/users/index.html',
      controller: 'UsersCtrl',
      access: {
        logged: true
      }
    })
    .when('/users/:id', {
      templateUrl: 'views/users/view.html',
      controller: 'ViewUsersCtrl',
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
    // reports
    .when('/reports', {
      templateUrl: 'views/reports/index.html',
      controller: 'ReportsCtrl',
      access: {
        logged: true
      }
    })
    .when('/reports/categories', {
      templateUrl: 'views/reports/categories.html',
      controller: 'ReportsCategoriesCtrl',
      access: {
        logged: true
      }
    })
    .when('/reports/categories/new', {
      templateUrl: 'views/reports/editCategory.html',
      controller: 'ReportsCategoriesEditCtrl',
      access: {
        logged: true
      }
    })
    .when('/reports/categories/:id/edit', {
      templateUrl: 'views/reports/editCategory.html',
      controller: 'ReportsCategoriesEditCtrl',
      access: {
        logged: true
      }
    })
    .when('/reports/categories/:categoryId/item/:id', {
      templateUrl: 'views/reports/view.html',
      controller: 'ReportsCategoriesItemCtrl',
      access: {
        logged: true
      }
    })
    // inventory
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
    .when('/inventories/:categoryId/item/:id', {
      templateUrl: 'views/items/view.html',
      controller: 'ViewItemCtrl',
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
      },

      // check for expected errors
      // if not, show generic system error
      'responseError': function(rejection) {

        var expectedErrors = rejection.config.expectedErrors;

        if (!(typeof expectedErrors !== 'undefined' && expectedErrors.indexOf(rejection.status) !== -1))
        {
          $injector.invoke(['Error', function(Error) {
            Error.showDetails(rejection);
          }]);
        }

        return $q.reject(rejection);
      }
    };
  }]);

  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];

  // Configure Restangular
  RestangularProvider.setBaseUrl('http://staging.zup.sapience.io');
  RestangularProvider.setFullResponse(true);
  //Restangular.setDefaultRequestParams({'X-App-Token': "secret key"});

  // Return what is being requested
  RestangularProvider.setResponseExtractor(function(response, operation, what) {
    if (typeof response[what] !== 'undefined')
    {
      return response[what];
    }

    for (var key in response)
    {
      return response[key];
    }

    return response;
  });

  RestangularProvider.setRequestInterceptor(function(elem, operation) {
    if (operation === "remove") {
      return null;
    }

    return elem;
  });
})

.run(['$rootScope', '$location', 'Auth', function($rootScope, $location, Auth) {

  $rootScope.$on('$routeChangeStart', function(e, curr, prev) {

    if (typeof prev === 'undefined')
    {
      $rootScope.isLoading = true;
    }

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
