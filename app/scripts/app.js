'use strict';

angular.module('zupPainelApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
  'ui.mask',
  'ui.select2',
  'restangular',
  'infinite-scroll',
  'colorpicker.module',
  'frapontillo.bootstrap-switch',
  'angularFileUpload',
  'ui.autocomplete',
  'ngAnimate'
])

.config(function ($routeProvider, $httpProvider, RestangularProvider) {

  // Configure each route
  $routeProvider
    .when('/', {
      templateUrl: 'views/login.html',
      controller: 'MainCtrl'
    })
    .when('/logout', {
      templateUrl: 'views/login.html',
      controller: 'LogoutCtrl'
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
      templateUrl: 'views/groups/edit.html',
      controller: 'GroupsEditCtrl',
      access: {
        logged: true
      }
    })
    .when('/groups/:id', {
      templateUrl: 'views/groups/list.html',
      controller: 'GroupsViewCtrl',
      access: {
        logged: true
      }
    })
    .when('/groups/:id/edit', {
      templateUrl: 'views/groups/edit.html',
      controller: 'GroupsEditCtrl',
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
    .when('/users/add', {
      templateUrl: 'views/users/edit.html',
      controller: 'UsersEditCtrl',
      access: {
        logged: true
      }
    })
    .when('/users/:id', {
      templateUrl: 'views/users/view.html',
      controller: 'UsersViewCtrl',
      access: {
        logged: true
      }
    })
    .when('/users/edit/:id', {
      templateUrl: 'views/users/edit.html',
      controller: 'UsersEditCtrl',
      access: {
        logged: true
      }
    })
    // reports
    .when('/reports', {
      templateUrl: 'views/reports/index.html',
      controller: 'ReportsCtrl',
      reloadOnSearch: false,
      resolve: {
        'isMap': function() {
          return false;
        }
      },
      access: {
        logged: true
      }
    })
    .when('/reports/map', {
      templateUrl: 'views/reports/map.html',
      controller: 'ReportsCtrl',
      reloadOnSearch: false,
      resolve: {
        'isMap': function() {
          return true;
        }
      },
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
      controller: 'ReportsItemCtrl',
      access: {
        logged: true
      }
    })
    // inventories
    .when('/inventories', {
      templateUrl: 'views/inventories/index.html',
      controller: 'InventoriesCtrl',
      reloadOnSearch: false,
      resolve: {
        'isMap': function() {
          return false;
        }
      },
      access: {
        logged: true
      }
    })
    .when('/inventories/map', {
      templateUrl: 'views/inventories/map.html',
      controller: 'InventoriesCtrl',
      reloadOnSearch: false,
      resolve: {
        'isMap': function() {
          return true;
        }
      },
      access: {
        logged: true
      }
    })
    .when('/inventories/categories', {
      templateUrl: 'views/inventories/categories.html',
      controller: 'InventoriesCategoriesCtrl',
      access: {
        logged: true
      }
    })
    .when('/inventories/categories/add', {
      templateUrl: 'views/inventories/edit.html',
      controller: 'InventoriesCategoriesEditCtrl',
      access: {
        logged: true
      }
    })
    .when('/inventories/categories/:categoryId/edit', {
      templateUrl: 'views/inventories/edit.html',
      controller: 'InventoriesCategoriesEditCtrl',
      access: {
        logged: true
      }
    })
    .when('/inventories/categories/select', {
      templateUrl: 'views/inventories/select.html',
      controller: 'InventoriesCategoriesSelectCtrl',
      access: {
        logged: true
      }
    })
    .when('/inventories/categories/:categoryId/item/add', {
      templateUrl: 'views/inventories/items/edit.html',
      controller: 'InventoriesItemEditCtrl',
      access: {
        logged: true
      }
    })
    .when('/inventories/categories/:categoryId/item/:id/edit', {
      templateUrl: 'views/inventories/items/edit.html',
      controller: 'InventoriesItemEditCtrl',
      access: {
        logged: true
      }
    })
    .when('/inventories/categories/:categoryId/item/:id', {
      templateUrl: 'views/inventories/items/view.html',
      controller: 'InventoriesItemCtrl',
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
    // fluxos
    .when('/flows', {
      templateUrl: 'views/flows/index.html',
      controller: 'FlowsCtrl',
      access: {
        logged: true
      }
    })
    .when('/flows/:id', {
      templateUrl: 'views/flows/view.html',
      controller: 'FlowsViewCtrl',
      access: {
        logged: true
      }
    })
    .when('/flows/:flowId/steps/:id', {
      templateUrl: 'views/flows/steps/edit.html',
      controller: 'FlowsStepsCtrl',
      access: {
        logged: true
      }
    })
    // casos
    .when('/cases', {
      templateUrl: 'views/cases/index.html',
      controller: 'CasesCtrl',
      access: {
        logged: true
      }
    })
    .when('/cases/:id/flow/:flowId', {
      templateUrl: 'views/cases/edit.html',
      controller: 'CasesEditCtrl',
      access: {
        logged: true
      }
    })
    .when('/cases/new/flow/:flowId', {
      templateUrl: 'views/cases/edit.html',
      controller: 'CasesEditCtrl',
      access: {
        logged: true
      }
    })
    /*
    .when('/cases/show', {
      templateUrl: 'views/cases/show.html',
      access: {
        logged: true
      }
    })
    .when('/cases/history', {
      templateUrl: 'views/cases/history.html',
      access: {
        logged: true
      }
    })
    .when('/cases/new', {
      templateUrl: 'views/cases/new.html',
      access: {
        logged: true
      }
    })
    .when('/cases/edit', {
      templateUrl: 'views/cases/edit.html',
      controller: 'CasesCtrl',
      access: {
        logged: true
      }
    })
    .when('/cases/finished', {
      templateUrl: 'views/cases/finished.html',
      access: {
        logged: true
      }
    })*/
    .otherwise({
      redirectTo: '/'
    });

  // Not supported on github :-(
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

        var expectedErrors = [400];

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
    // we first check if what we want do exist
    if (typeof response[what] !== 'undefined')
    {
      return response[what];
    }

    // then return the first object in the response
    for (var key in response)
    {
      if (typeof response[key] === 'object')
      {
        return response[key];
      }
    }

    for (var x in response)
    {
      return response[x];
    }

    return response;
  });

  RestangularProvider.setRequestInterceptor(function(elem, operation) {
    if (operation === 'remove') {
      return null;
    }

    return elem;
  });
})

.run(['$rootScope', '$location', 'Auth', '$timeout', function($rootScope, $location, Auth, $timeout) {

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

  $rootScope.showMessage = function(icon, text, messageClass, scrollTop) {
    $rootScope.systemMessage = {icon: icon, text: text, messageClass: messageClass};
    $rootScope.showSystemMessage = true;

    $timeout(function() { $rootScope.showSystemMessage = false; }, 3500);

    if (scrollTop === true)
    {
      $rootScope.scrollTop = true;
    }
  };
}]);
