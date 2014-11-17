'use strict';

angular
  .module('ItemsCategoriesDestroyModalControllerModule', [])
  .controller('ItemsCategoriesDestroyModalController', function(Restangular, $scope, $modalInstance, inventoriesCategoriesList, category) {
    $scope.category = category;

    // delete user from server
    $scope.confirm = function() {
      var deletePromise = Restangular.one('inventory').one('categories', $scope.category.id).remove();

      deletePromise.then(function() {
        $modalInstance.close();

        // remove user from list
        inventoriesCategoriesList.splice(inventoriesCategoriesList.indexOf($scope.category), 1);
      });
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
