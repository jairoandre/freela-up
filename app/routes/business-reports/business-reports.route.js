angular
  .module('BusinessReportsModule', [
    'BusinessReportsIndexModule'
  ])
  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('business_reports', {
      url: '/business_reports',
      templateUrl: 'routes/business-reports/business-reports.template.html',
      resolve: {
        'User': ['User', function(User) {
          return User({ permissions: ['isLogged'] });
        }]
      },
      controller: ['$state', function($state){
        $state.go('business_reports.list');
      }]
    });

  }]);
