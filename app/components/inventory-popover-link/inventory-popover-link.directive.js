'use strict';

angular
  .module('InventoryPopoverLinkComponentModule', [])

  .directive('inventoryPopoverLink', function () {
    return {
      restrict: 'A',
      link: function postLink(scope) {
        scope.openPopover = function(attr) {
          scope.$emit('hidePopovers', true);

          scope.popover[attr] = true;
        };
      }
    };
  });
