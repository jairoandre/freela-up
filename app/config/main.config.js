'use strict';

angular
  .module('zupPainelApp')
  .config(['$urlRouterProvider', 'RestangularProvider', 'ENV', 'uiSelectConfig', '$provide', function($urlRouterProvider, RestangularProvider, ENV, uiSelectConfig, $provide) {
    $urlRouterProvider.otherwise('/');

    RestangularProvider.setBaseUrl(ENV.apiEndpoint);
    RestangularProvider.setFullResponse(true);

    // ui-select config
    uiSelectConfig.theme = 'bootstrap';

    // translate bs-switch
    $.fn.bootstrapSwitch.defaults.onText = 'Sim';
    $.fn.bootstrapSwitch.defaults.offText = 'Não';

    // Workaround for bug #1404
    // https://github.com/angular/angular.js/issues/1404
    // Source: http://plnkr.co/edit/hSMzWC?p=preview
    $provide.decorator('ngModelDirective', ['$delegate', function($delegate) {
        var ngModel = $delegate[0], controller = ngModel.controller;
        ngModel.controller = ['$scope', '$element', '$attrs', '$injector', function(scope, element, attrs, $injector) {
            var $interpolate = $injector.get('$interpolate');
            attrs.$set('name', $interpolate(attrs.name || '')(scope));
            $injector.invoke(controller, this, {
                '$scope': scope,
                '$element': element,
                '$attrs': attrs
            });
        }];
        return $delegate;
    }]);

    $provide.decorator('formDirective', ['$delegate', function($delegate) {
        var form = $delegate[0], controller = form.controller;
        form.controller = ['$scope', '$element', '$attrs', '$injector', function(scope, element, attrs, $injector) {
            var $interpolate = $injector.get('$interpolate');
            attrs.$set('name', $interpolate(attrs.name || attrs.ngForm || '')(scope));
            $injector.invoke(controller, this, {
                '$scope': scope,
                '$element': element,
                '$attrs': attrs
            });
        }];
        return $delegate;
    }]);
  }])
  .run(['Restangular', 'Auth', '$rootScope', '$timeout', 'Error', '$http', 'FullResponseRestangular', 'ENV', '$window', function(Restangular, Auth, $rootScope, $timeout, Error, $http, FullResponseRestangular, ENV, $window) {
    Restangular.setDefaultHeaders({'X-App-Token': Auth.getToken()});
    FullResponseRestangular.setDefaultHeaders({'X-App-Token': Auth.getToken()});

    $rootScope.flowsEnabled = (ENV.flowsEnabled === 'true' || ENV.flowsEnabled === 'TRUE');

    if(ENV.env == 'development')
    {
      $rootScope.errorReporting = true;
      $rootScope.mapDebugEnabled = true;
    }

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

    // FIXME THIS IS WHATEVER FOLKS
    // https://github.com/angular/angular.js/issues/10349
    // :@
    function transformResponse(data) {
      var PROTECTION_PREFIX = /^\)\]\}',?\n/;

      if (typeof data === 'string') {
        data = data.replace(PROTECTION_PREFIX, '');

        try {
          data = JSON.parse(data);
        } catch (e) {
          return data;
        }
      }

      return data;
    }

    $http.defaults.transformResponse = [transformResponse];

    var errorInterceptor = function(response, deferred, responseHandler) {
      if (response.status === 401 && (typeof response.config.treatingUnauthorizedErrors === 'undefined' || response.config.treatingUnauthorizedErrors === false))
      {
        Error.show('expired_session');
      }
      else if (typeof response.config.treatingErrors === 'undefined' || response.config.treatingErrors === false)
      {
        Error.show(response);
      }

      return true;
    };

    Restangular.setErrorInterceptor(errorInterceptor);
    FullResponseRestangular.setErrorInterceptor(errorInterceptor);

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

      if (fromState.name.length !== 0)
      {
        $rootScope.resolvingRoute = true;
        $rootScope.uiHasScroll = false;
        $rootScope.uiDebugMap = false;
      }
    });

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      if (fromState.name.length === 0)
      {
        $rootScope.hideInitialLoading = true;
      }

      $timeout(function() {
        $rootScope.resolvingRoute = false;
        $rootScope.resolvingRequest = false;
      }, 150);
    });

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      if (error.status === 403) $window.location = '/';
      else if (error.status === 404) $window.location = '/';
      else if (error.status === 401) Error.show('expired_session');
      else Error.show(error);
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

    $rootScope.logoImg = (ENV.logoImgUrl.length > 0) ? ENV.logoImgUrl : 'assets/images/logos/logo-zup.png';
  }]);
