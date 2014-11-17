angular
  .module('ItemsCategoriesEditModule', [
    'ItemsCategoriesEditControllerModule',
  ])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('items.categories.edit', {
      url: '/{id:[0-9]{1,4}}/edit',

      views: {
        '@': {
          templateUrl: 'routes/items/categories/edit/items-categories-edit.template.html',
          controller: 'ItemsCategoriesEditController',
          controllerAs: 'ctrl',
          resolve: {
            'categoryResponse': ['Restangular', '$stateParams', function(Restangular, $stateParams) {
              return Restangular.one('inventory').one('categories', $stateParams.id).get({display_type: 'full'});
            }],

            'groupsResponse': ['Restangular', function(Restangular) {
              return Restangular.all('groups').getList();
            }],
          }
        }
      }
    }).state('items.categories.add', {
      url: '/add',

      views: {
        '@': {
          templateUrl: 'routes/items/categories/edit/items-categories-edit.template.html',
          controller: 'ItemsCategoriesEditController',
          controllerAs: 'ctrl',
          resolve: {
            'categoryResponse': function() {
              return false;
            },

            'groupsResponse': ['Restangular', function(Restangular) {
              return Restangular.all('groups').getList();
            }],
          }
        }
      }
    });

  }]);
