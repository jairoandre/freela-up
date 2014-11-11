'use strict';

angular
  .module('zupPainelApp')
  .config(['$urlRouterProvider', 'RestangularProvider', 'ENV', function($urlRouterProvider, RestangularProvider, ENV) {
    $urlRouterProvider.otherwise('/');

    RestangularProvider.setBaseUrl(ENV.apiEndpoint);
    RestangularProvider.setFullResponse(true);

    RestangularProvider.setRequestInterceptor(function(elem, operation) {
      if (operation === 'remove') {
        return null;
      }

      return elem;
    });
  }])
  .run(['Restangular', 'Auth', '$rootScope', '$timeout', function(Restangular, Auth, $rootScope, $timeout) {
    Restangular.setDefaultHeaders({'X-App-Token': Auth.getToken()});

    // Return what is being requested
    Restangular.addResponseInterceptor(function(response, operation, what) {
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

    $rootScope.$on('$stateChangeStart', function() {
      $rootScope.resolvingRoute = true;
    });

    $rootScope.$on('$stateChangeSuccess', function() {
      $timeout(function() {
        $rootScope.resolvingRoute = false;
      }, 150);
    });

    // FIXME let's put this in a directive, please, Mr. Gabriel? :-D
    $rootScope.glyphicons = {
      'exclamation-sign': 'glyphicon-exclamation-sign',
      'ok': 'glyphicon-ok',
    };

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
