angular
  .module('ItemsEditModule', [
    'ItemsEditControllerModule'
  ])

  .constant('categoryReturnFields', [
    'id', 'marker', 'pin', 'plot_format', 'require_item_status', 'statuses', 'title',
    'sections.id', 'sections.title', 'sections.disabled', 'sections.required', 'sections.location', 'sections.position',
    'sections.fields.id', 'sections.fields.disabled', 'sections.fields.title', 'sections.fields.kind', 'sections.fields.label',
    'sections.fields.available_values', 'sections.fields.field_options', 'sections.fields.position', 'sections.fields.maximum',
    'sections.fields.minimum', 'sections.fields.required'
  ])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('items.show.edit', {
      url: '/category/{categoryId:[0-9]{1,9}}/edit',
      views: {
        '@': {
          templateUrl: 'routes/items/edit/items-edit.template.html',
          controller: 'ItemsEditController',
          controllerAs: 'ctrl',
          resolve: {
            'categoryResponse': ['Restangular', '$stateParams', 'categoryReturnFields', function(Restangular, $stateParams, categoryReturnFields) {
              return Restangular.one('inventory').one('categories', $stateParams.categoryId).get({'display_type': 'full', 'return_fields': categoryReturnFields.join()});
            }],

            'itemResponse': ['Restangular', '$stateParams', function(Restangular, $stateParams) {
              var itemReturnFields = ['id', 'position', 'title', 'data.content', 'data.id', 'data.selected_options', 'field.id', 'locked', 'locker'];

              return Restangular.one('inventory').one('items', $stateParams.id).get({ 'return_fields': itemReturnFields.join() });
            }]
          }
        }
      }
    }).state('items.add', {
      url: '/category/{categoryId:[0-9]{1,9}}/add',
      views: {
        '@': {
          templateUrl: 'routes/items/edit/items-edit.template.html',
          controller: 'ItemsEditController',
          controllerAs: 'ctrl',
          resolve: {
            'categoryResponse': ['Restangular', '$stateParams', 'categoryReturnFields', function(Restangular, $stateParams, categoryReturnFields) {

              return Restangular.one('inventory').one('categories', $stateParams.categoryId).get({'display_type': 'full', 'return_fields': categoryReturnFields.join()});
            }],

            'itemResponse': function() {
              return false;
            }
          }
        }
      }
    });
  }]);
