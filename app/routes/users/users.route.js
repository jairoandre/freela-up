angular
  .module('UsersModule', [
    'UsersIndexModule',
    'UsersShowModule',
    'UsersEditModule',
  ])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('users', {
      abstract: true,
      url: '/users',
      templateUrl: 'routes/users/users.template.html',
      resolve: {
        'User': ['User', function(User) {
          return User({ permissions: ['isLogged'] });
        }],
        'Authorize': function ($rootScope, $state, User) {
          if (!$rootScope.hasAnyPermission(['users_full_access', 'users_edit'])) {
            $rootScope.showMessage(
              'exclamation-sign',
              'Você não possui permissão para visualizar essa página.',
              'error'
            );

            $state.go('items.list');
          }
        }
      }
    });

  }]);
