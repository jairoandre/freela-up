angular
  .module('BusinessReportsIndexModule', [
    'BusinessReportsIndexControllerModule'
  ])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('business_reports.list', {
      url: '',
      views: {
        '': {
          templateUrl: 'routes/business_reports/index/business_reports-index.template.html',
          controller: 'BusinessReportsIndexController',
          controllerAs: 'ctrl'
        }
      }
    });

  }]);
