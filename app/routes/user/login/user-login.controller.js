angular
  .module('UserLoginControllerModule', [])

  .controller('UserLoginController', function($scope, $state, Auth) {
    $scope.login = function() {
      $scope.loginError = false;
      $scope.processingRequest = true;

      Auth.login($scope.email, $scope.password).then(function() {
        $state.go('reports.list');
      }, function(response) {
        $scope.loginError = true;
        $scope.processingRequest = false;
      });
    };
  });
