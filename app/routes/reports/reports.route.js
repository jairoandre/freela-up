angular
  .module('ReportsModule', [
    'ReportsIndexModule',
    'ReportsShowModule',
    'ReportsEditModule',
    'ReportsCategoriesIndexModule',
    'ReportsCategoriesEditModule'
  ])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('reports', {
      abstract: true,
      url: '/reports',
      templateUrl: 'routes/reports/reports.template.html',
      resolve: {
        'User': ['User', function(User) {
          return User({ permissions: ['isLogged'] });
        }]
      }
    });

  }]);
