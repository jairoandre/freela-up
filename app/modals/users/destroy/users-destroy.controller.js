'use strict';

angular
  .module('UsersDestroyModalControllerModule', [])

  .controller('UsersDestroyModalController', function(Restangular, $scope, $modalInstance, user, usersList) {
    $scope.user = user;

    // delete user from server
    $scope.confirm = function() {
      usersList.splice(usersList.indexOf($scope.user), 1);
    };

    $scope.confirm = function() {
      var deletePromise = Restangular.one('users', $scope.user.id).remove();

      deletePromise.then(function() {
        $modalInstance.close();
        $scope.showMessage('ok', 'O Usuário ' + $scope.user.name + ' foi removido com sucesso.', 'success', true);

        usersList.splice(usersList.indexOf($scope.user), 1);
      });
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
