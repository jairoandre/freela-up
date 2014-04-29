'use strict';

angular.module('zupPainelApp')
  .directive('onFocus', function () {
    return {
        restrict: 'A',
        link: function(scope, elm, attrs) {
            console.log('onfocus');
            elm.bind('focus', function() {
                scope.$apply(attrs.onFocus);
            });
        }
    };
  });
