'use strict';

// okay whatevs I stopped using this directive :P
/* jshint ignore:start */
angular.module('zupPainelApp')

.directive('hackSidebarHeight', function () {
  return {
    link: function postLink(scope, element) {
      scope.$watch(function(){ return angular.element(document).height(); }, function(newValue) {
        //element.height(newValue);
      });
    }
  };
});
/* jshint ignore:end */
