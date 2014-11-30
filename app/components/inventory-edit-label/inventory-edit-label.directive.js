'use strict';

angular
  .module('InventoryEditLabelComponentModule', [])
  .directive('inventoryEditLabel', function ($timeout) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {

        scope.editLabel = function() {
          if (attrs.inventoryEditLabel === 'section')
          {
            scope.label = angular.copy(scope.section.label);
            scope.editingSectionLabel = true;
          }
          else
          {
            scope.label = angular.copy(scope.field.label);
            scope.editingLabel = true;
          }

          $timeout(function() {
            element.find('.editLabelField').focus();
          });
        };

        scope.saveLabel = function() {
          if (attrs.inventoryEditLabel === 'section')
          {
            scope.section.label = scope.label;
            scope.editingSectionLabel = false;
          }
          else
          {
            scope.field.label = scope.label;
            scope.editingLabel = false;
          }
        };

        // detect "esc" key on input
        element.find('.editLabelField').keyup(function(e) {
          if (e.keyCode === 13)
          {
            scope.saveLabel();

            scope.$apply();
          };

          if (e.keyCode === 27)
          {
            if (attrs.inventoryEditLabel === 'section')
            {
              scope.editingSectionLabel = false;
            }
            else
            {
              scope.editingLabel = false;
            }

            scope.$apply();
          };
        });
      }
    };
  });
