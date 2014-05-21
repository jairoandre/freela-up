'use strict';

angular.module('zupPainelApp')
  .directive('inventoryPopover', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        scope.popover = {permissions: false, options: false, remove: false};

        scope.$on('hideOpenPopovers', function(event, data) {
          for (var x in scope.popover)
          {
            if (scope.popover[x] === true)
            {
              scope.popover[x] = false;
            }
          }
        });
      }
    };
  });
