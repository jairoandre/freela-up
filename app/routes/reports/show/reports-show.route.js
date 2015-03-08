angular
  .module('ReportsShowModule', [
    'ReportsShowControllerModule'
  ])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('reports.show', {
      url: '/{id:[0-9]{1,4}}',
      resolve: {
        'reportResponse': ['Restangular', '$stateParams', function(Restangular, $stateParams) {
          return Restangular.one('reports').one('items', $stateParams.id).get();
        }],

        'feedbackResponse': ['Restangular', '$stateParams', function(Restangular, $stateParams) {
          return Restangular.one('reports', $stateParams.id).one('feedback').get();
        }],

        'categoriesResponse': ['Restangular', '$stateParams', function(Restangular, $stateParams) {
          return Restangular.one('reports').all('categories').getList({ 'display_type': 'full' });
        }],

      },
      views: {
        '': {
          templateUrl: 'routes/reports/show/reports-show.template.html',
          controller: 'ReportsShowController',
          controllerAs: 'ctrl'
        }
      }
    });
  }]);
