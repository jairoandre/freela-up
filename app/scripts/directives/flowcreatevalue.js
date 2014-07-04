'use strict';

angular.module('zupPainelApp')
  .directive('flowCreateValue', function () {
    return {
      restrict: 'A',
      link: function postLink(scope) {
        scope.newValue = function() {
          scope.field.values[0] = 'Nova opção';
        };
      }
    };
  });
