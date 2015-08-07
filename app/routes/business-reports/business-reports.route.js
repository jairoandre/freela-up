angular
  .module('BusinessReportsModule', [
    'BusinessReportsIndexModule',
    'BusinessReportsEditModule'
  ])
  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('business_reports', {
      url: '/business-reports',
      templateUrl: 'routes/business-reports/business-reports.template.html',
      abstract: true,
      resolve: {
        'User': ['User', function(User) {
          return User({ permissions: ['isLogged'] });
        }]
      }
    });

  }]);
