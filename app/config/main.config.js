'use strict';

angular
  .module('zupPainelApp')
  .config(['$urlRouterProvider', 'RestangularProvider', 'ENV', 'uiSelectConfig', '$tooltipProvider', '$provide', function($urlRouterProvider, RestangularProvider, ENV, uiSelectConfig, $tooltipProvider, $provide) {
    $urlRouterProvider.otherwise('/');

    RestangularProvider.setBaseUrl(ENV.apiEndpoint);
    RestangularProvider.setFullResponse(true);

    // add a response interceptor for prevent 'getList SHOULD be array error' which occur when the data is already an array.
    RestangularProvider.addResponseInterceptor(function (data, operation, what, url, response, deferred) {
      // .. to look for getList operations
      if (operation === "getList") {
        // When the data is already an array
        if (angular.isArray(data)) {
          var extractedData = {};
          extractedData.data = data;
          return extractedData;
        }
      }
      return data;
    });

    // ui-select config
    uiSelectConfig.theme = 'bootstrap';

    // angular-bootstrap tooltip
    $tooltipProvider.options({
      appendToBody: true
    });

    // translate bs-switch
    $.fn.bootstrapSwitch.defaults.onText = 'Sim';
    $.fn.bootstrapSwitch.defaults.offText = 'Não';

    // Workaround for bug #1404
    // https://github.com/angular/angular.js/issues/1404
    // Source: http://plnkr.co/edit/hSMzWC?p=preview
    $provide.decorator('ngModelDirective', ['$delegate', function ($delegate) {
      var ngModel = $delegate[0], controller = ngModel.controller;
      ngModel.controller = ['$scope', '$element', '$attrs', '$injector', function (scope, element, attrs, $injector) {
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

    $provide.decorator('formDirective', ['$delegate', function ($delegate) {
      var form = $delegate[0], controller = form.controller;
      form.controller = ['$scope', '$element', '$attrs', '$injector', function (scope, element, attrs, $injector) {
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
  .factory('singleItemUploaderFilter', function(){
    return {
      name: 'fixQueueLimit',
      fn: function(item, options) {
        if(this.queue.length === 1) {
          this.clearQueue();
        }
        return true;
      }
    };
  })
  .factory('onlyImagesUploaderFilter', function(){
    return function(isHTML5) {
      return {
        name: 'onlyImages',
        fn: function (item, options) {
          var type = isHTML5 ? item.type : '/' + item.value.slice(item.value.lastIndexOf('.') + 1);
          type = '|' + type.toLowerCase().slice(type.lastIndexOf('/') + 1) + '|';
          return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
      };
    };
  })
  .run(['Restangular', 'Auth', '$rootScope', '$timeout', '$templateCache', 'Error', '$http', 'FullResponseRestangular', 'ENV', '$window', function (Restangular, Auth, $rootScope, $timeout, $templateCache, Error, $http, FullResponseRestangular, ENV, $window) {

    $templateCache.put("template/modal/backdrop.html",
      "<div class=\"modal-backdrop fade {{ backdropClass }}\"\n" +
      "     ng-class=\"{in: animate}\"\n" +
      "     ng-style=\"{'z-index': 10040 + (index && 1 || 0) + index*10}\"\n" +
      "></div>\n" +
      "");

    $templateCache.put("template/modal/window.html",
      "<div tabindex=\"-1\" role=\"dialog\" class=\"modal fade\" ng-class=\"{in: animate}\" ng-style=\"{'z-index': 10050 + index*10, display: 'block'}\" ng-click=\"close($event)\">\n" +
      "    <div class=\"modal-dialog\" ng-class=\"{'modal-sm': size == 'sm', 'modal-lg': size == 'lg'}\"><div class=\"modal-content\" modal-transclude></div></div>\n" +
      "</div>");

    Restangular.setDefaultHeaders({'X-App-Token': Auth.getToken()});
    FullResponseRestangular.setDefaultHeaders({'X-App-Token': Auth.getToken()});

    $rootScope.flowsEnabled = (ENV.flowsEnabled === 'true' || ENV.flowsEnabled === 'TRUE');

    if (ENV.name == 'development') {
      $rootScope.errorReporting = true;
      $rootScope.mapDebugEnabled = true;
    }

    // Return what is being requested
    Restangular.addResponseInterceptor(function (response, operation, what) {
      // we first check if what we want do exist
      if (angular.isDefined(response[what])) {
        return response[what];
      }

      // then return the first object in the response
      for (var key in response) {
        if (angular.isObject(response[key])) {
          return response[key];
        }
      }

      for (var x in response) {
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

    var errorInterceptor = function (response, deferred, responseHandler) {
      if (response.status === 401 && (angular.isUndefined(response.config.treatingUnauthorizedErrors) || response.config.treatingUnauthorizedErrors === false)) {
        Error.show('expired_session');
      }
      else if (typeof response.config.treatingErrors === 'undefined' || response.config.treatingErrors === false) {
        Error.show(response);
      }

      return true;
    };

    Restangular.setErrorInterceptor(errorInterceptor);
    FullResponseRestangular.setErrorInterceptor(errorInterceptor);

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

      if (fromState.name.length !== 0) {
        $rootScope.resolvingRoute = true;
        $rootScope.uiHasScroll = false;
        $rootScope.uiDebugMap = false;
      }
    });

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      $rootScope.stateClass = 'state-' + toState.name.replace(".", "-").replace("_", "-");
      if (fromState.name.length === 0) {
        $rootScope.hideInitialLoading = true;
      }

      $timeout(function () {
        $rootScope.resolvingRoute = false;
        $rootScope.resolvingRequest = false;
      }, 150);
    });

    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
      $rootScope.stateClass = '';
      if (error.status === 403) {
        $window.location = '/';
      } else if (error.status === 404) {
        $window.location = '/';
      } else if (error.status === 401) {
        Error.show('expired_session');
      } else {
        Error.show(error);
      }
    });

    $rootScope.$on('$stateNotFound',function(event, unfoundState, fromState, fromParams){
      console.log('$stateNotFound '+unfoundState.to+'  - fired when a state cannot be found by its name.');
      console.log(unfoundState, fromState, fromParams);
    });

    $rootScope.glyphicons = {
      'exclamation-sign': 'glyphicon-exclamation-sign',
      'ok': 'glyphicon-ok'
    };

    $rootScope.showMessage = function (icon, text, messageClass, scrollTop) {
      $rootScope.systemMessage = {icon: icon, text: text, messageClass: messageClass};
      $rootScope.showSystemMessage = true;

      $timeout(function () {
        $rootScope.showSystemMessage = false;
      }, 3500);

      if (scrollTop === true) {
        $rootScope.scrollTop = true;
      }
    };

    $rootScope.addModalMessage = function (icon, text, messageClass) {
      $rootScope.modalMessage = {icon: icon, text: text, messageClass: messageClass};
      $timeout(function () {
        $rootScope.showModalMessage = true;
      }, 100);

      $timeout(function () {
        $rootScope.showModalMessage = false;
        $timeout(function () {
          $rootScope.modalMessage = {icon: null, text: null, messageClass: null};
        }, 1000);
      }, 3500);
    };
    $rootScope.logoImg = (ENV.logoImgUrl.length > 0) ? ENV.logoImgUrl : 'assets/images/logos/logo-zup.png';
    $rootScope.theme = ENV.theme;
  }])
  .filter('abs', function () {
  return function(val) {
    return Math.abs(val);
  }
});
