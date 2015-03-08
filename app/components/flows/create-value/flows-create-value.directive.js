'use strict';

angular
  .module('FlowsCreateValueComponentModule', [])

  .directive('flowsCreateValue', function () {
    return {
      restrict: 'A',
      link: function postLink(scope) {
        scope.newValue = function() {
          scope.field.values[0] = 'Nova opção';
        };
      }
    };
  });
