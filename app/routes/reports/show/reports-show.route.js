angular
  .module('ReportsShowModule', [
    'ReportsShowControllerModule',
    'ReportsShowPrintModule'
  ])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('reports.show', {
      url: '/{id:[0-9]{1,9}}',
      resolve: {
        'reportResponse': ['Restangular', '$stateParams', function(Restangular, $stateParams) {
          return Restangular.one('reports').one('items', $stateParams.id).get();
        }],

        'feedbackResponse': ['Restangular', '$stateParams', function(Restangular, $stateParams) {
          return Restangular.one('reports', $stateParams.id).one('feedback').get();
        }],

        'commentsResponse': ['Restangular', '$stateParams', function(Restangular, $stateParams) {
          return Restangular.one('reports', $stateParams.id).all('comments').getList();
        }],

        'reportHistoryResponse': ['Restangular', '$stateParams', function(Restangular, $stateParams) {
          return Restangular.one('reports').one('items', $stateParams.id).one('history').getList();
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
