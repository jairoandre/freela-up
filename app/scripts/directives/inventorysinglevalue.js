'use strict';

angular.module('zupPainelApp')
  .directive('inventorySingleValue', function () {
    return {
      restrict: 'A',
      link: function postLink(scope) {
        scope.removeValue = function(value) {
          var index = scope.$parent.field.available_values.indexOf(value); // jshint ignore:line

          if (index !== -1)
          {
            scope.$parent.field.available_values.splice(index, 1); // jshint ignore:line
          }
        };
      }
    };
  });
