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
            'id', 'protocol', 'address', 'number', 'district', 'country', 'country', 'postal_code', 'state', 'city', 'created_at', 'description', 'comment_required_when_updating_status',
            'feedback', 'images', 'inventory_item', 'inventory_item_category_id', 'overdue', 'position', 'reference', 'status',
            'notifications.notification_type.title', 'notifications.notification_type.default_deadline_in_days', 'notifications.created_at', 'notifications.days_to_deadline',
            'notifications.content', 'notifications.active', 'user.name', 'user.email', 'user.id', 'user.phone',
            'assigned_user.id', 'assigned_user.name', 'assigned_group.id', 'assigned_group.name',
            'category.id', 'category.marker', 'category.notifications', 'category.icon', 'category.solver_groups.id',
            'category.solver_groups.name', 'category.comment_required_when_updating_status', 'category.comment_required_when_forwarding',
            'category.solver_groups_ids', 'category.statuses', 'category.title', 'category.default_solver_group.name', 'category.default_solver_group.id', 'perimeter'
          ];

          return Restangular.one('reports').one('items', $stateParams.id).get({ 'return_fields': returnFields.join() });
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
