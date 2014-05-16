'use strict';

angular.module('zupPainelApp')
  .directive('inputsSidebar', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {
        element.affix({
          offset: {
            top: 75
          }
        });
      }
    };
  });
