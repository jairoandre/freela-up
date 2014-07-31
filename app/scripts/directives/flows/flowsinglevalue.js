'use strict';

angular.module('zupPainelApp')
  .directive('flowSingleValue', function () {
    return {
      restrict: 'A',
      link: function postLink(scope) {
        scope.editValue = angular.copy(scope.value);

        scope.saveValue = function() {
          scope.editingValue = false;

          var index = scope.$parent.field.available_values.indexOf(scope.value); // jshint ignore:line
          scope.$parent.field.available_values[index] = scope.editValue; // jshint ignore:line

        };

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
