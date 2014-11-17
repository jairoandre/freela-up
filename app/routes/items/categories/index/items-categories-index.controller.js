'use strict';

angular
  .module('ItemsCategoriesIndexControllerModule', [
    'ItemsCategoriesDestroyModalControllerModule'
  ])

  .controller('ItemsCategoriesIndexController', function ($scope, categoriesResponse, $modal) {
    $scope.categories = categoriesResponse.data;

    $scope.deleteCategory = function (category) {
      $modal.open({
        templateUrl: 'modals/items/categories/destroy/items-categories-destroy.template.html',
        windowClass: 'removeModal',
        resolve: {
          inventoriesCategoriesList: function() {
            return $scope.categories;
          },

          category: function() {
            return category;
          }
        },
        controller: 'ItemsCategoriesDestroyModalController'
      });
    };
  });
