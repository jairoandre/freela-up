angular
  .module('ItemsEditModule', [
    'ItemsEditControllerModule'
  ])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('items.show.edit', {
      url: '/category/{categoryId:[0-9]{1,4}}/edit',
      views: {
        '@': {
          templateUrl: 'routes/items/edit/items-edit.template.html',
          controller: 'ItemsEditController',
          controllerAs: 'ctrl',
          resolve: {
            'categoryResponse': ['Restangular', '$stateParams', function(Restangular, $stateParams) {
              return Restangular.one('inventory').one('categories', $stateParams.categoryId).get({display_type: 'full'});
            }]
          }
        }
      }
    }).state('items.add', {
      url: '/category/{categoryId:[0-9]{1,4}}/add',
      views: {
        '@': {
          templateUrl: 'routes/items/edit/items-edit.template.html',
          controller: 'ItemsEditController',
          controllerAs: 'ctrl',
          resolve: {
            'categoryResponse': ['Restangular', '$stateParams', function(Restangular, $stateParams) {
              return Restangular.one('inventory').one('categories', $stateParams.categoryId).get({display_type: 'full'});
            }],

            'itemResponse': function() {
              return false;
            }
          }
        }
      }
    });
  }]);
