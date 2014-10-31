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
        }
      }
    });
  }]);
