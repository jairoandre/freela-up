angular
  .module('BusinessReportsEditModule', [
    'BusinessReportsEditControllerModule',
    'BusinessReportsServiceModule'
  ])

  .config(['$stateProvider', function ($stateProvider) {

    $stateProvider.state('business_reports.edit', {
      url: '/{reportId:[0-9]{1,9}}/edit',
      views: {
        '': {
          templateUrl: 'routes/business-reports/edit/business-reports-edit.template.html',
          controller: 'BusinessReportsEditController'
        }
      },
      resolve: {
        'report': ['BusinessReportsService', '$stateParams', function (BusinessReportsService, $stateParams) {
          return BusinessReportsService.find($stateParams.reportId);
        }]
      }
    });

    $stateProvider.state('business_reports.add', {
      url: '/add',
      views: {
        '': {
          templateUrl: 'routes/business-reports/edit/business-reports-edit.template.html',
          controller: 'BusinessReportsEditController'
        }
      },
      resolve: {
        'report': ['$q', function ($q) {
          var deferred = $q.defer();
          deferred.resolve({charts: []});
          return deferred.promise;
        }]
      }
    });

  }]);
