angular
  .module('ItemsSelectCategoryModule', [
    'ItemsSelectCategoryControllerModule'
  ])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('items.select-category', {
      url: '/select-category',
      views: {
        '@': {
          templateUrl: 'routes/items/select-category/items-select-category.template.html',
          controller: 'ItemsSelectCategoryController',
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
