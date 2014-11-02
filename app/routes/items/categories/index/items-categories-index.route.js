angular
  .module('ItemsCategoriesIndexModule', [
    'ItemsCategoriesIndexControllerModule',
  ])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('items.categories', {
      url: '/categories',

      views: {
        '': {
          templateUrl: 'routes/items/categories/index/items-categories-index.template.html',
          controller: 'ItemsCategoriesIndexController',
          controllerAs: 'ctrl',
          resolve: {
            'categoriesResponse': ['Restangular', function(Restangular) {
              return Restangular.one('inventory').all('categories').getList();
            }]
          }
        }
      }
    });

  }]);
