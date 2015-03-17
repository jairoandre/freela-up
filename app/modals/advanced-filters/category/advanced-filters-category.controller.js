'use strict';

angular
  .module('AdvancedFiltersCategoryModalControllerModule', [])
  .controller('AdvancedFiltersCategoryModalController', function($scope, $rootScope, $modalInstance, activeAdvancedFilters, categoriesResponse) {
    $rootScope.resolvingRequest = false;
    $scope.categories = [];
    $scope.activeAdvancedFilters = activeAdvancedFilters;

    // TODO Simplify this when inventory categories get its own API Client service
    var categories = typeof categoriesResponse.data !== 'undefined' ? categoriesResponse.data : categoriesResponse;

    for (var i = categories.length - 1; i >= 0; i--) {
      $scope.categories.push(categories[i]);

      if (typeof categories[i].subcategories !== 'undefined' && categories[i].subcategories.length !== 0)
      {
        for (var j = categories[i].subcategories.length - 1; j >= 0; j--) {
          $scope.categories.push(categories[i].subcategories[j]);
        }
      }
    }

    // TODO Remove after the loops above have been cleared on the InventoryItemsService update
    $scope.categories = _.uniq($scope.categories);

    $scope.updateCategory = function(category) {
      var i = $scope.categories.indexOf(category);

      if ($scope.categories[i].selected === true)
      {
        $scope.categories[i].selected = false;
      }
      else
      {
        $scope.categories[i].selected = true;
      }
    };

    $scope.save = function() {
      for (var i = $scope.categories.length - 1; i >= 0; i--) {
        if ($scope.categories[i].selected === true)
        {
          var filter = {
            title: 'Categoria',
            type: 'categories',
            desc: $scope.categories[i].title,
            value: $scope.categories[i].id
          };

          $scope.activeAdvancedFilters.push(filter);
        }
      }

      $modalInstance.close();
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
