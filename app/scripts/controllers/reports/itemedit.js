'use strict';

angular.module('zupPainelApp')

.controller('ReportsItemEditCtrl', function ($scope, Restangular, $routeParams, $q, $modal, FileUploader) {
  $scope.uploader = new FileUploader();

  var reportsCategoriesPromise = Restangular.all('reports').all('categories').getList({'display_type': 'full'});
  var inventoryCategoriesPromise = Restangular.all('inventory').all('categories').getList({'display_type': 'full'});

  $q.all([reportsCategoriesPromise, inventoryCategoriesPromise]).then(function(responses) {
    $scope.categories = responses[0].data;
    $scope.inventoryCategories = responses[1].data;
  });

  $scope.getInventoryCategory = function(id) {
    for (var i = $scope.inventoryCategories.length - 1; i >= 0; i--) {
      if ($scope.inventoryCategories[i].id === id)
      {
        return $scope.inventoryCategories[i];
      }
    }

    return null;
  };

  $scope.selectCategory = function(categoryData) {
    $scope.categoryData = categoryData;
  };
});
