angular
  .module('GroupsShowModule', [
    'GroupsShowControllerModule'
  ])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('groups.show', {
      url: '/{id:[0-9]{1,4}}',
      resolve: {
        'groupsPermissionsResponse': ['Restangular', '$stateParams', function(Restangular, $stateParams) {
          return Restangular.one('groups', $stateParams.id).all('permissions').getList();
        }]
      },
      views: {
        '': {
          templateUrl: 'routes/groups/show/groups-show.template.html',
          controller: 'GroupsShowController',
          controllerAs: 'ctrl'
        }
      }
    });
  }]);
