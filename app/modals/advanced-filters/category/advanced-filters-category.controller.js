'use strict';

angular
  .module('AdvancedFiltersCategoryModalControllerModule', [])
  .controller('AdvancedFiltersCategoryModalController', function($scope, $modalInstance, categories, activeAdvancedFilters) {
    $scope.categories = categories;
    $scope.activeAdvancedFilters = activeAdvancedFilters;

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
