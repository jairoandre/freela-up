'use strict';

angular
  .module('ItemsDestroyModalControllerModule', [])
  .controller('ItemsDestroyModalController', function($scope, $modalInstance, removeItemFromList, item, category, Restangular, $state) {
    $scope.item = item;
    $scope.category = category;

    // delete user from server
    $scope.confirm = function() {
      var deletePromise = Restangular.one('inventory').one('categories', $scope.category.id).one('items', $scope.item.id).remove();

      deletePromise.then(function() {
        $modalInstance.close();
        $scope.showMessage('ok', 'O Inventário ' + $scope.item.title + ' foi removido com sucesso', 'success', true);

        if (removeItemFromList)
        {
          removeItemFromList($scope.item);
        }
        else
        {
          $state.go('items.list');
        }
      });
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
