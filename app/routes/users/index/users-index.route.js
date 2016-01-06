angular
  .module('UsersIndexModule', [
    'UsersIndexControllerModule',
  ])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('users.list', {
      url: '',
      resolve: {
        'Authorize': function ($rootScope, $route) {
          if (!$rootScope.hasAnyPermission(['users_full_access', 'users_edit')) {
            $rootScope.showMessage(
              'exclamation-sign',
              'Você não possui permissão para visualizar essa página.',
              'error'
            );

            $route.go('items.list');
          }
        },
        'groupsResponse': ['Restangular', function(Restangular) {
          return Restangular.all('groups').getList({ 'return_fields': 'id,name' });
        }]
      },
      views: {
        '': {
          templateUrl: 'routes/users/index/users-index.template.html',
          controller: 'UsersIndexController',
          controllerAs: 'ctrl'
        }
      }
    });

  }]);
