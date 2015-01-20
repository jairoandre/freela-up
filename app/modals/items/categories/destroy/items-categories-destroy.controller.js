'use strict';

angular
  .module('ItemsCategoriesDestroyModalControllerModule', [])
  .controller('ItemsCategoriesDestroyModalController', function(Restangular, $scope, $modalInstance, inventoriesCategoriesList, category, $cookies) {
    $scope.category = category;

    // delete user from server
    $scope.confirm = function() {
      var deletePromise = Restangular.one('inventory').one('categories', $scope.category.id).remove();

      deletePromise.then(function() {
        delete $cookies.inventoryFiltersHash; // we need to remove the saved filters because the user might have selected the category

        $modalInstance.close();

        // remove user from list
        inventoriesCategoriesList.splice(inventoriesCategoriesList.indexOf($scope.category), 1);
      });
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
