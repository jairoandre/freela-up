angular
  .module('BusinessReportsEditModule', [
    'BusinessReportsEditControllerModule'
  ])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('business_reports.edit', {
      url: '/{reportId:[0-9]{1,9}}/edit',
      views: {
        '': {
          templateUrl: 'routes/business-reports/edit/business-reports-edit.template.html',
          controller: 'BusinessReportsEditController'
        }
      }
    });

    $stateProvider.state('business_reports.add', {
      url: '/add',
      views: {
        '': {
          templateUrl: 'routes/business-reports/edit/business-reports-edit.template.html',
          controller: 'BusinessReportsEditController'
        }
      }
    });

  }]);
