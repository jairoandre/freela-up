'use strict';

angular.module('zupPainelApp')
  .directive('bootstrapSwitch', function () {
    return {
      link: function(scope, element) {
        element.bootstrapSwitch();
      }
    };
  });
