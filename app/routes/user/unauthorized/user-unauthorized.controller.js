angular
  .module('UserUnauthorizedControllerModule', [])

  .controller('UserUnauthorizedController', function($rootScope, Auth) {
    if (!_.isUndefined($rootScope.hasPermission) && $rootScope.hasPermission('panel_access'))
    {
      $state.go('/');
    }

    Auth.clearToken();
    Auth.clearUser();
  });
