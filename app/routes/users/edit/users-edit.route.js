 angular
  .module('UsersEditModule', [
    'UsersEditControllerModule'
  ])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('users.show.edit', {
      url: '/edit',
      views: {
        '@users': {
          templateUrl: 'routes/users/edit/users-edit.template.html',
          controller: 'UsersEditController',
          controllerAs: 'ctrl',
          resolve: {
            'groupsResponse': ['Restangular', function(Restangular) {
              return Restangular.all('groups').getList();
            }]
          }
        }
      }
    }).state('users.add', {
      url: '/add',
      views: {
        '': {
          templateUrl: 'routes/users/edit/users-edit.template.html',
          controller: 'UsersEditController',
          controllerAs: 'ctrl',
          resolve: {
            'groupsResponse': ['Restangular', function(Restangular) {
              return Restangular.all('groups').getList();
            }]
          }
        }
      }
    });
  }]);
