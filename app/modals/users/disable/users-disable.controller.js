'use strict';

angular
  .module('UsersDisableModalControllerModule', [])

  .controller('UsersDisableModalController', function(Restangular, $scope, $modalInstance, user, usersList) {
    $scope.user = user;

    // delete user from server
    $scope.confirm = function() {
      usersList.splice(usersList.indexOf($scope.user), 1);
    };

    $scope.confirm = function() {
      var deletePromise = Restangular.one('users', $scope.user.id).remove();

      deletePromise.then(function() {
        $modalInstance.close();
        $scope.showMessage('ok', 'O Usuário ' + $scope.user.name + ' foi desativado com sucesso.', 'success', false);

        user.disabled = true;
      });
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
