angular
  .module('ItemsShowModule', [
    'ItemsShowControllerModule'
  ])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('items.show', {
      url: '/{id:[0-9]{1,4}}',
      views: {
        '': {
          templateUrl: 'routes/items/show/items-show.template.html',
          controller: 'ItemsShowController',
          controllerAs: 'ctrl',
        }
      }
    });
  }]);
