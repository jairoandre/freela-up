'use strict';

angular
  .module('StyleResultsTableComponentModule', [])
  .directive('styleResultsTable', function ($timeout) {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {
        var changeMargin = function() {
          element.find('.custom_table').css({'margin-top': element.find('.advancedSearch').height()});
        };

        changeMargin();

        scope.$watch('activeAdvancedFilters', function() {
          $timeout(function() {
            changeMargin();
          });
        }, true);
      }
    };
  });
