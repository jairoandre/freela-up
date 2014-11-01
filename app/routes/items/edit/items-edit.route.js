angular
  .module('ItemsEditModule', [
    'ItemsEditControllerModule'
  ])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('items.show.edit', {
      url: '/edit',
      views: {
        '@items': {
          templateUrl: 'routes/items/edit/items-edit.template.html',
          controller: 'ItemsEditController',
          controllerAs: 'ctrl',
        }
      }
    }).state('items.add', {
      url: '/add',
      views: {
        '': {
          templateUrl: 'routes/items/edit/items-edit.template.html',
          controller: 'ItemsEditController',
          controllerAs: 'ctrl',
        }
      }
    });
  }]);
