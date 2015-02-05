'use strict';

angular
  .module('ReportsEditCategoryModalControllerModule', [])
  .controller('ReportsEditCategoryModalController', function(Restangular, $scope, $modalInstance, category, report, categories, $rootScope, $state) {
    var categories = categories.data;
    $scope.categories = [];

    for (var i = categories.length - 1; i >= 0; i--) {
      $scope.categories.push(categories[i]);

      if (categories[i].subcategories.length !== 0)
      {
        for (var j = categories[i].subcategories.length - 1; j >= 0; j--) {
          $scope.categories.push(categories[i].subcategories[j]);
        };
      }
    };

    $rootScope.resolvingRequest = false;
    $scope.report = angular.copy(report);
    $scope.category = category;

    $scope.transfer = { toCategory: null, toStatus: null };

    // category select functions
    $scope.subCategories = function(item) {
      if (item.parent_id == null)
      {
        return 'Categorias principais';
      }

      if (item.parent_id !== null)
      {
        return 'Subcategorias';
      }
    };

    $scope.$watch('transfer.toCategory', function(newValue, oldValue) {
      if (newValue !== oldValue)
      {
        for (var i = $scope.categories.length - 1; i >= 0; i--) {
          if ($scope.categories[i].id === parseInt($scope.transfer.toCategory))
          {
            return $scope.categoryData = $scope.categories[i];
          }

          // we search into subcategories
          if ($scope.categories[i].subcategories.length !== 0)
          {
            for (var j = $scope.categories[i].subcategories.length - 1; j >= 0; j--) {
              if ($scope.categories[i].subcategories[j].id === parseInt($scope.transfer.toCategory))
              {
                return $scope.categoryData = $scope.categories[i].subcategories[j];
              }
            };
          }
        };
      }
    });

    $scope.confirm = function() {
      $modalInstance.close();
      $rootScope.resolvingRequest = true;

      var changeStatusPromise = Restangular.one('reports', $scope.category.id).one('items', $scope.report.id).customPUT({ 'new_category_id': $scope.transfer.toCategory, 'new_status_id': $scope.transfer.toStatus }, 'change_category'); // jshint ignore:line

      changeStatusPromise.then(function() {
        $scope.showMessage('ok', 'A categoria do relato foi alterada com sucesso!', 'success', true);

        // refresh page because we change crucial information about our report
        $state.go($state.current, {}, {reload: true});
      });
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
