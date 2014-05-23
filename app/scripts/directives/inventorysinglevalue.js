'use strict';

angular.module('zupPainelApp')
  .directive('inventorySingleValue', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        scope.removeValue = function(value) {
          var index = scope.$parent.field.available_values.indexOf(value);

          if (index !== -1)
          {
            scope.$parent.field.available_values.splice(index, 1);
          }
        };
      }
    };
  });
