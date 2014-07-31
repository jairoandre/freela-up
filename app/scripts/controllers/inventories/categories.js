'use strict';

angular.module('zupPainelApp')

.controller('InventoriesCategoriesCtrl', function ($scope, Restangular, $modal) {
  $scope.loading = true;

  var categoriesPromise = Restangular.one('inventory').all('categories').getList();

  categoriesPromise.then(function(response) {
    $scope.categories = response.data;

    $scope.loading = false;
  });

  $scope.deleteCategory = function (category) {
    $modal.open({
      templateUrl: 'views/inventories/removeCategory.html',
      windowClass: 'removeModal',
      resolve: {
        inventoriesCategoriesList: function(){
          return $scope.categories;
        }
      },
      controller: ['$scope', '$modalInstance', 'inventoriesCategoriesList', function($scope, $modalInstance, inventoriesCategoriesList) {
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
      }]
    });
  };
});
