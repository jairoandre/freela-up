angular
  .module('UsersIndexModule', [
    'UsersIndexControllerModule',
  ])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('users.list', {
      url: '',
      resolve: {
        'groupsResponse': ['Restangular', function(Restangular) {
          return Restangular.all('groups').getList();
        }]
      },
      views: {
        '': {
          templateUrl: 'routes/users/index/users-index.template.html',
          controller: 'UsersIndexController',
          controllerAs: 'ctrl',
        }
      }
    });

  }]);
