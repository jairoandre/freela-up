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
              return Restangular.all('reports').all('categories').getList({ 'display_type': 'full', return_fields: 'id,title' });
            }],

            'groupsResponse': ['Restangular', function(Restangular) {
              return Restangular.all('groups').getList({ return_fields: 'id,name'});
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
              return Restangular.all('reports').all('categories').getList({ return_fields: 'id,title'});
            }],

            'groupsResponse': ['Restangular', function(Restangular) {
              return Restangular.all('groups').getList({ return_fields: 'id,name'});
            }]
          }
        }
      }
    });

  }]);
