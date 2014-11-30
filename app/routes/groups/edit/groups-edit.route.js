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
          controllerAs: 'ctrl'
        }
      }
    }).state('groups.add', {
      url: '/add',
      views: {
        '': {
          templateUrl: 'routes/groups/edit/groups-edit.template.html',
          controller: 'GroupsEditController',
          controllerAs: 'ctrl'
        }
      }
    });
  }]);
