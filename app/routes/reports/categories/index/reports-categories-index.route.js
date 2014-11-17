angular
  .module('ReportsCategoriesIndexModule', [
    'ReportsCategoriesIndexControllerModule',
  ])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('reports.categories', {
      url: '/categories',

      views: {
        '': {
          templateUrl: 'routes/reports/categories/index/reports-categories-index.template.html',
          controller: 'ReportsCategoriesIndexController',
          controllerAs: 'ctrl',
        }
      }
    });

  }]);
