angular
  .module('ReportsIndexModule', [
    'ReportsIndexControllerModule',
    'ReportsIndexMapModule',
    'StyleResultsTableComponentModule'
  ])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('reports.list', {
      url: '',

      views: {
        '': {
          templateUrl: 'routes/reports/index/reports-index.template.html',
          controller: 'ReportsIndexController',
          controllerAs: 'ctrl',
          resolve: {
            'categoriesResponse': ['Restangular', function(Restangular) {
              return Restangular.one('reports').all('categories').getList({'display_type' : 'full'});
            }],

            'isMap': function() {
              return false;
            }
          }
        }
      }
    });

  }]);
