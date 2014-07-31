'use strict';

angular.module('zupPainelApp')
  .filter('replaceDotWithComma', function () {
    return function (input) {
      if (typeof input === 'undefined')
      {
        return;
      }

      return input.replace('.', ',');
    };
  });
