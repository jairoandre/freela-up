'use strict';

angular.module('zupPainelApp')
  .filter('formatErrors', function ($sce) {
    return function (errors) {
      var formattedErrors = [];

      for (var index in errors)
      {
        for (var i = 0; i < errors[index].length; i++) {
          var capitalizedIndex = index.charAt(0).toUpperCase() + index.slice(1);

          formattedErrors.push(capitalizedIndex + ' ' + errors[index][i]);
        };
      }

      return $sce.trustAsHtml(formattedErrors.join('<br>'));
    };
  });
