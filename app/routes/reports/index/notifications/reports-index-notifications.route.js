angular
  .module('ReportsIndexNotificationsModule', [
    'ReportsIndexControllerModule',
    'StyleResultsTableComponentModule'
  ])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('reports.list.notifications', {
      url: '/notifications',

      views: {
        '@reports': {
          templateUrl: 'routes/reports/index/notifications/reports-index-notifications.template.html',
          controller: 'ReportsIndexController',
          controllerAs: 'ctrl',
          resolve: {
            'isMap': function() {
              return false;
            }
          }
        }
      }
    });

  }]);
