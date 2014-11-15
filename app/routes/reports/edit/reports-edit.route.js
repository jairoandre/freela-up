angular
  .module('ReportsEditModule', [
    'ReportsEditControllerModule'
  ])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('reports.show.edit', {
      url: '/edit',
      views: {
        '@reports': {
          templateUrl: 'routes/reports/edit/reports-edit.template.html',
          controller: 'ReportsEditController',
          controllerAs: 'ctrl',
        }
      }
    }).state('reports.add', {
      url: '/add',
      views: {
        '': {
          templateUrl: 'routes/reports/edit/reports-edit.template.html',
          controller: 'ReportsEditController',
          controllerAs: 'ctrl',
          resolve: {
            'inventoriesCategoriesResponse': ['Restangular', '$stateParams', function(Restangular, $stateParams) {
              return Restangular.all('inventory').all('categories').getList({'display_type': 'full'})
            }],

            'reportCategoriesResponse': ['Restangular', '$stateParams', function(Restangular, $stateParams) {
              return Restangular.all('reports').all('categories').getList({'display_type': 'full'});
            }],
          }
        }
      }
    });
  }]);
