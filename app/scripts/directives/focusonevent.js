'use strict';

angular.module('zupPainelApp')
  .directive('focusOnEvent', function () {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        scope.$on(attrs.focusOnEvent, function() {
          element.focus();
        })
      }
    };
  });
