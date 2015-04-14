angular
  .module('UserLoginControllerModule', [
    'UserPasswordRecoverModalControllerModule'
  ])

  .controller('UserLoginController', function($scope, $rootScope, $state, Auth, $modal) {
    var img = $scope.logoImg;

    $scope.blueLogoImg = img.substring(0, img.lastIndexOf('.')) + '-blue' + img.substring(img.lastIndexOf('.'));

    $scope.login = function() {
      $scope.loginError = false;
      $scope.processingRequest = true;

      Auth.login($scope.email, $scope.password).then(function() {
        $state.go('reports.list');
      }, function(response) {
        $scope.loginError = true;
        $scope.processingRequest = false;
      });

      return false;
    };

    $scope.recoverPassword = function() {
      $modal.open({
        templateUrl: 'modals/user/password-recovery/user-password-recovery.template.html',
        windowClass: 'removeModal',
        controller: 'UserPasswordRecoveryModalController'
      });
    };
  });
