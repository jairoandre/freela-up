'use strict';

angular
  .module('ItemsSelectCategoryControllerModule', [])

  .controller('ItemsSelectCategoryController', function ($scope, Restangular) {
    $scope.loading = true;

    var categoriesPromise = Restangular.one('inventory').all('categories').getList();

    categoriesPromise.then(function(response) {
      $scope.categories = response.data;

      $scope.loading = false;
    });
  });
