angular
  .module('UsersIndexModule', [
    'UsersIndexControllerModule',
  ])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('users.list', {
      url: '',

      views: {
        '': {
          templateUrl: 'routes/users/index/users-index.template.html',
          controller: 'UsersIndexController',
          controllerAs: 'ctrl',
        }
      }
    }).state('users.list.groups', {
      url: '/group/{groupId:[0-9]{1,4}}',

      views: {
        '@users': {
          templateUrl: 'routes/users/index/users-index.template.html',
          controller: 'UsersIndexController',
          controllerAs: 'ctrl',
        }
      }
    });

  }]);
