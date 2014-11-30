angular
  .module('GroupsIndexModule', [
    'GroupsIndexControllerModule'
  ])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('groups.list', {
      url: '',

      views: {
        '': {
          templateUrl: 'routes/groups/index/groups-index.template.html',
          controller: 'GroupsIndexController',
          controllerAs: 'ctrl',
        }
      }
    });

  }]);
