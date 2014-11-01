angular
  .module('ItemsIndexMapModule', [
    'StyleMapComponentModule',
    'MapComponentModule'
  ])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('items.list.map', {
      url: '/map',

      views: {
        '@items': {
          templateUrl: 'routes/items/index/map/items-index-map.template.html',
          controller: 'ReportsIndexController',
          controllerAs: 'ctrl',
          resolve: {
            'categoriesResponse': ['Restangular', function(Restangular) {
              return Restangular.one('inventory').all('categories').getList({'display_type' : 'full'});
            }],

            'isMap': function() {
              return true;
            }
          }
        }
      }
    });

  }]);
