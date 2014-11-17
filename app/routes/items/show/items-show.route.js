angular
  .module('ItemsShowModule', [
    'ItemsShowControllerModule'
  ])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('items.show', {
      url: '/{id:[0-9]{1,4}}',
      resolve: {
        'itemResponse': ['Restangular', '$stateParams', function(Restangular, $stateParams) {
          return Restangular.one('inventory').one('items', $stateParams.id).get();
        }],
      },
      views: {
        '': {
          templateUrl: 'routes/items/show/items-show.template.html',
          controller: 'ItemsShowController',
          controllerAs: 'ctrl',
          resolve: {
            'categoriesResponse': ['Restangular', function(Restangular) {
              return Restangular.one('inventory').one('categories').get({display_type: 'full'});
            }]
          }
        }
      }
    });
  }]);
