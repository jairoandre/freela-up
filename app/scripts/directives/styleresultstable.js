'use strict';

angular.module('zupPainelApp')
  .directive('styleResultsTable', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {
        var changeMargin = function() {
          if (scope.advancedSearch === true)
          {
            element.css({'margin-top': $('#advancedSearch').height()});
          }
          else
          {
            element.removeAttr('style');
          }
        };

        scope.$watch('advancedSearch', function() {
          changeMargin();
        });

        scope.$watch('active_advanced_filters', function() {
          changeMargin();
        }, true);
      }
    };
  });
