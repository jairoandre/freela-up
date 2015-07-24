angular
  .module('GroupsEditModule', [
    'GroupsEditControllerModule'
  ])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('groups.show.edit', {
      url: '/edit',
      views: {
        '@groups': {
          templateUrl: 'routes/groups/edit/groups-edit.template.html',
          controller: 'GroupsEditController',
          controllerAs: 'ctrl',
          resolve: {
            'groupResponse': ['Restangular', '$stateParams', function(Restangular, $stateParams) {
              return Restangular.one('groups', $stateParams.id).get();
            }],

            'groupsPermissionsResponse': ['FullResponseRestangular', '$stateParams', function(FullResponseRestangular, $stateParams) {
              return FullResponseRestangular.one('groups', $stateParams.id).all('permissions').customGET();
            }],

            'objectsResponse': ['FullResponseRestangular', function(FullResponseRestangular) {
              return FullResponseRestangular.one('utils').all('available_objects').customGET();
            }]
          }
        }
      }
    });
  }]);
