'use strict';

angular.module('zupPainelApp')
  .directive('onBlur', function () {
    return {
      restrict: 'A',
      link: function(scope, elm, attrs) {
        elm.bind('blur', function() {
          if (typeof attrs.onBlurDelay !== 'undefined')
          {
            setTimeout(function() {
              scope.$apply(attrs.onBlur);
            }, attrs.onBlurDelay);
          }
          else
          {
            scope.$apply(attrs.onBlur);
          }
        });
      }
    };
  });
