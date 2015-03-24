angular
  .module('ReportsIndexMapModule', [
    'StyleMapComponentModule',
    'MapComponentModule'
  ])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('reports.list.map', {
      url: '/map',

      views: {
        '@reports': {
          templateUrl: 'routes/reports/index/map/reports-index-map.template.html',
          controller: 'ReportsIndexController',
          controllerAs: 'ctrl',
          resolve: {
            'isMap': function() {
              return true;
            }
          }
        }
      }
    });

  }]);
