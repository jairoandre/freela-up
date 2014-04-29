'use strict';

angular.module('zupPainelApp')
  .directive('styleResultsTable', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var changeMargin = function() {
          if (scope.advanced_search == true)
          {
            element.css({'margin-top': $('#advanced_search').height()});
          }
          else
          {
            element.removeAttr("style");
          }
        };

        scope.$watch('advanced_search', function() {
          changeMargin();
        });

        scope.$watch('active_advanced_filters', function() {
         changeMargin();
        }, true);
      }
    };
  });
