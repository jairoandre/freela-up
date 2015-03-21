angular
  .module('IndexControllerModule', [])

  .controller('IndexController', function(User, $state, $rootScope) {
    if (User)
    {
      if ($rootScope.hasAnyPermission(['inventories_full_access', 'inventories_categories_edit', 'inventories_items_read_only', 'inventories_items_delete', 'inventories_items_edit', 'inventories_items_create']))
      {
        $state.go('items.list');
      }
      else
      {
        $state.go('reports.list');
      }
    }
    else
    {
      $state.go('user.login');
    }
  });
