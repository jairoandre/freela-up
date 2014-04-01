'use strict';

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
