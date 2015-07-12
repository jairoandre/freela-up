angular
  .module('ReportsCategoriesNotificationsModule', [
    'ReportsCategoriesNotificationsControllerModule',
  ])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('reports.categories.notifications',{
      url: '/notifications',
      abstract: false
    }).state('reports.categories.notifications.edit', {
      url: '/{categoryId:[0-9]{1,4}}/{id:[0-9]{1,4}}/edit',
      views: {
        '@': {
          templateUrl: 'routes/reports/categories/notifications/reports-categories-notifications.template.html',
          controller: 'ReportsCategoriesNotificationsController',
          controllerAs: 'ctrl'
        }
      }
    }).state('reports.categories.notifications.add', {
      url: '/{categoryId:[0-9]{1,4}}/add',
      views: {
        '@': {
          templateUrl: 'routes/reports/categories/notifications/reports-categories-notifications.template.html',
          controller: 'ReportsCategoriesNotificationsController',
          controllerAs: 'ctrl'
        }
      }
    });

  }]);
