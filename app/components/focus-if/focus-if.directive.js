'use strict';

angular.module('FocusIfComponentModule', [])
  .directive('focusIf', function ($timeout, $parse) {
    return {
      //scope: true,   // optionally create a child scope
      link: function (scope, element, attrs) {
        var ctx = $parse(attrs.focusIf);
        if (ctx.literal === true) {
          $timeout(function () {
            element[0].focus();
          }, 400);
        }
      }
    };
  });
