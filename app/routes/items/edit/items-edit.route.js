angular
    .module('ItemsEditModule', [
      'ItemsEditControllerModule'
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
              'categoryResponse': ['Restangular', '$stateParams', function(Restangular, $stateParams) {
                var returnFields = [
                  'id','marker', 'pin', 'plot_format', 'require_item_status', 'statuses', 'title',
                  'sections.id', 'sections.title', 'sections.disabled', 'sections.required', 'sections.location', 'sections.position',
                  'sections.fields.id', 'sections.fields.disabled', 'sections.fields.title', 'sections.fields.kind', 'sections.fields.label',
                  'sections.fields.available_values', 'sections.fields.field_options', 'sections.fields.position', 'sections.fields.maximum',
                  'sections.fields.minimum', 'sections.fields.required'
                ];

                return Restangular.one('inventory').one('categories', $stateParams.categoryId).get({'display_type': 'full', 'return_fields': returnFields.join()});
              }],

              'itemResponse': ['Restangular', '$stateParams', function(Restangular, $stateParams) {
                return Restangular.one('inventory').one('items', $stateParams.id).get();
              }],
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
              'categoryResponse': ['Restangular', '$stateParams', function(Restangular, $stateParams) {
                var returnFields = [
                  'id','marker', 'pin', 'plot_format', 'require_item_status', 'statuses', 'title',
                  'sections.id', 'sections.title', 'sections.disabled', 'sections.required', 'sections.location', 'sections.position',
                  'sections.fields.id', 'sections.fields.disabled', 'sections.fields.title', 'sections.fields.kind', 'sections.fields.label',
                  'sections.fields.available_values', 'sections.fields.field_options', 'sections.fields.position', 'sections.fields.maximum',
                  'sections.fields.minimum', 'sections.fields.required'
                ];

                return Restangular.one('inventory').one('categories', $stateParams.categoryId).get({'display_type': 'full', 'return_fields': returnFields.join()});
              }],

              'itemResponse': function() {
                return false;
              }
            }
          }
        }
      });
    }]);
