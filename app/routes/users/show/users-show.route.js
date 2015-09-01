angular
  .module('UsersShowModule', [
    'UsersShowControllerModule'
  ])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('users.show', {
      url: '/{id:[0-9]{1,4}}',
      views: {
        '': {
          templateUrl: 'routes/users/show/users-show.template.html',
          controller: 'UsersShowController',
          controllerAs: 'ctrl',
          resolve: {
            'userResponse': ['Restangular', '$stateParams', function(Restangular, $stateParams) {
              return Restangular.one('users', $stateParams.id).get();
            }]
          }
        }
      }
    });
  }]);
