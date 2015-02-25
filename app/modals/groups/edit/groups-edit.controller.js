'use strict';

angular
  .module('GroupsEditModalControllerModule', [])
  .controller('GroupsEditModalController', function(Restangular, $scope, $modalInstance, $state, group) {
    $scope.group = group || { name: '', permissions: {} };

    $scope.save = function() {
      $scope.processingForm = true;

      var groupPromise = group === null ? Restangular.one('groups').post(null, $scope.group) : Restangular.one('groups', groupId).customPUT($scope.group);

      groupPromise.then(function(response) {
        $scope.processingForm = false;

        if (group)
        {
          $scope.showMessage('ok', 'O grupo foi editado.', 'success', true);
        }
        else
        {
          $scope.showMessage('ok', 'O grupo foi criado com sucesso.', 'success', true);
          $state.go('groups.show', { id: response.data.id });
        }

        $modalInstance.close();
      }, function(response) {
        $scope.processingForm = false;
      });
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
