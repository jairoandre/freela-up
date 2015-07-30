angular
  .module('ReportsIndexMapModule', [
    //'ReportsIndexControllerModule',
    'StyleMapComponentModule',
    'MapComponentModule'
  ])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('reports.index.map', {
      url: '/map',

      views: {
        '': {
          templateUrl: 'routes/reports/index/map/reports-index-map.template.html',
          controller: function() {
            "use strict";
            console.log('maps');
          },
          //controller: 'ReportsIndexController',
          //controllerAs: 'ctrl',
        }
      }
    });

  }]);
