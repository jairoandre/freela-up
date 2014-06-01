'use strict';

angular.module('zupPainelApp')
  .directive('fieldsFilterItem', function () {
    return {
      restrict: 'A',
      link: function postLink(scope) {
        scope.changeCondition = function(condition) {
          scope.item.condition = condition;
        };

        scope.changeField = function(field) {
          scope.item.field = field;
        };

        scope.delete = function() {
          scope.$parent.items.splice(scope.$parent.items.indexOf(scope.item), 1);
        };
      }
    };
  });
