angular
  .module('UserUnauthorizedControllerModule', [])

  .controller('UserUnauthorizedController', function($rootScope, Auth) {
    if (!_.isUndefined($rootScope.hasPermission) && $rootScope.hasPermission('panel_access'))
    {
      $state.go('/');
    }

    Auth.clearToken();
    Auth.clearUser();

    var img = $scope.logoImg;

    $scope.blueLogoImg = img.substring(0, img.lastIndexOf('.')) + '-blue' + img.substring(img.lastIndexOf('.'));
  });
