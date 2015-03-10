angular
  .module('GroupsShowModule', [
    'GroupsShowControllerModule'
  ])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('groups.show', {
      url: '/{id:[0-9]{1,4}}',
      views: {
        '': {
          templateUrl: 'routes/groups/show/groups-show.template.html',
          controller: 'GroupsShowController',
          controllerAs: 'ctrl'
        }
      }
    });
  }]);
