'use strict';

angular
  .module('StyleResultsTableComponentModule', [])
  .directive('styleResultsTable', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {
        var changeMargin = function() {
          element.find('.custom_table').css({'margin-top': element.find('.advancedSearch').height()});
        };

        changeMargin();

        scope.$watch('activeAdvancedFilters', function() {
          changeMargin();
        }, true);
      }
    };
  });
