angular
  .module('UserLoginControllerModule', [])

  .controller('UserLoginController', function($scope, $state, Auth) {
    $scope.login = function() {
      $scope.loginError = false;

      Auth.login($scope.email, $scope.password).then(function() {
        $state.go('reports.list');
      }, function(response) {
        $scope.loginError = true;
      });
    };
  });
