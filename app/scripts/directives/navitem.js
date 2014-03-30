'use strict';

angular.module('zupPainelApp')
  .directive('navItem', function ($location) {
    return {
      restrict: 'A',

      link: function(scope, element) {
        var toPath = element.find('a')[0].href;

        scope.location = $location;
        scope.$watch('location.absUrl()', function(currentPath) {
          if (!currentPath.indexOf(toPath))
          {
            element.addClass('active');
          }
          else
          {
            element.removeClass('active');
          }
        });
      }
    };
  });
