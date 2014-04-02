'use strict';

angular.module('zupPainelApp')
  .directive('detectScrollTop', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        scope.$watch('scrollTop', function() {
          if (scope.scrollTop === true)
          {
            element.animate({scrollTop: 0}, 900);
            scope.scrollTop = false;
          }
        });
      }
    };
  });
