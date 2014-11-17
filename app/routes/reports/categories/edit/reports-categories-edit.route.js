angular
  .module('ReportsCategoriesEditModule', [
    'ReportsCategoriesEditControllerModule',
  ])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('reports.categories.edit', {
      url: '/{id:[0-9]{1,4}}/edit',

      views: {
        '@reports': {
          templateUrl: 'routes/reports/categories/edit/reports-categories-edit.template.html',
          controller: 'ReportsCategoriesEditController',
          controllerAs: 'ctrl',
          resolve: {
            'reportCategoriesResponse': ['Restangular', function(Restangular) {
              return Restangular.all('reports').all('categories').getList({ 'display_type': 'full' });
            }]
          }
        }
      }
    }).state('reports.categories.add', {
      url: '/add',

      views: {
        '@reports': {
          templateUrl: 'routes/reports/categories/edit/reports-categories-edit.template.html',
          controller: 'ReportsCategoriesEditController',
          controllerAs: 'ctrl',
          resolve: {
            'reportCategoriesResponse': ['Restangular', function(Restangular) {
              return Restangular.all('reports').all('categories').getList();
            }]
          }
        }
      }
    });

  }]);
