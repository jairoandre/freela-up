angular
  .module('ReportsShowModule', [
    'ReportsShowControllerModule',
    'ReportsShowPrintModule'
  ])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('reports.show', {
      url: '/{id:[0-9]{1,9}}',
      resolve: {
        'reportResponse': ['Restangular', '$stateParams', function(Restangular, $stateParams) {
          var returnFields = [
            'id', 'protocol', 'address', 'comments', 'created_at', 'description', 'feedback', 'images', 'inventory_item', 'inventory_item_category_id', 'overdue', 'position', 'reference', 'status',
            'user.name', 'user.email', 'user.id', 'user.phone',
            'assigned_user.id', 'assigned_user.name', 'assigned_group.id', 'assigned_group.name',
            'category.id', 'category.marker', 'category.icon', 'category.solver_groups.id', 'category.solver_groups.name', 'category.solver_groups_ids', 'category.statuses', 'category.title', 'category.default_solver_group.name', 'category.default_solver_group.id'
          ];

          return Restangular.one('reports').one('items', $stateParams.id).get({ 'return_fields': returnFields.join() });
        }],

        'feedbackResponse': ['Restangular', '$stateParams', function(Restangular, $stateParams) {
          return Restangular.one('reports', $stateParams.id).one('feedback').get({
            return_fields: 'id,kind,content,images'
          });
        }],

        'commentsResponse': ['Restangular', '$stateParams', function(Restangular, $stateParams) {
          return Restangular.one('reports', $stateParams.id).all('comments').getList({
            return_fields: 'id,created_at,message,visibility,author.id,author.name'
          });
        }]
      },
      views: {
        '': {
          templateUrl: 'routes/reports/show/reports-show.template.html',
          controller: 'ReportsShowController',
          controllerAs: 'ctrl'
        }
      }
    });
  }]);
