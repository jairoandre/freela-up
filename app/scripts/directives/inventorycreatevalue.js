'use strict';

angular.module('zupPainelApp')
  .directive('inventoryCreateValue', function () {
    return {
      restrict: 'A',
      link: function postLink(scope) {
        var count = 1;

        scope.newValue = function() {
          scope.field.available_values.push('Nova opção ' + count);

          count++;
        };
      }
    };
  });
