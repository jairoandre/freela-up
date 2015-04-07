'use strict';

angular
  .module('InventoryTriggerConditionComponentModule', [])

  .directive('inventoryTriggerCondition', function (Restangular) {
    return {
      restrict: 'A',
      link: function postLink(scope) {
        scope.$watch('condition.inventory_field_id', function() {
          console.log(scope.condition.inventory_field_id);
        });
      }
    };
  });
