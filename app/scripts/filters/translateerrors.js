'use strict';

angular.module('zupPainelApp')
  .filter('translateErrors', function () {
    return function (input) {
      var translations = {
        // messages
        'is missing': 'não pode estar em branco',

        // indexes
        'statuses': 'status de relatos',
        'title': 'título',
        'icon': 'ícone',
        'marker': 'marcador',
        'color': 'Cor'
      };

      if (typeof translations[input] !== 'undefined')
      {
        return translations[input];
      }

      return input;
    };
  });
