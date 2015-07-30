angular
  .module('ReportsIndexNotificationsModule', [
    //'ReportsIndexControllerModule',
    'StyleResultsTableComponentModule'
  ])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('reports.index.notifications', {
      url: '/notifications',

      views: {
        '': {
          templateUrl: 'routes/reports/index/notifications/reports-index-notifications.template.html',
          controller: function() {
            "use strict";
            console.log('notifications');
          },
          //controller: 'ReportsIndexController',
          //controllerAs: 'ctrl',
          //resolve: {
          //  'isMap': function() {
          //    return false;
          //  }
          //}
        }
      }
    });

  }]);
