'use strict';

angular
  .module('StyleResultsTableComponentModule', [])
  .directive('styleResultsTable', function ($timeout) {
    var timeoutId = null;
    return {
      restrict: 'A',
      link: function postLink(scope, element) {
        var changeMargin = function() {
          element.find('.custom_table').css({'margin-top': element.find('.advancedSearch').height()});
        };

        changeMargin();

        scope.$watch('activeAdvancedFilters', function() {
          if (timeoutId) {
            $timeout.cancel(timeoutId);
          }
          timeoutId = $timeout(function() {
            changeMargin();
          });
        }, true);
      }
    };
  });
