'use strict';

angular
  .module('AdvancedFiltersCategoryModalControllerModule', [])
  .controller('AdvancedFiltersCategoryModalController', function($scope, $rootScope, $modalInstance, activeAdvancedFilters, categoriesResponse) {
    $rootScope.resolvingRequest = false;
    $scope.categories = [];
    $scope.activeAdvancedFilters = activeAdvancedFilters;
    var selectedCategoriesIDs = [];

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

    _.each($scope.activeAdvancedFilters, function(filter){
      if(filter.type == 'categories' && selectedCategoriesIDs.indexOf(filter.value) === -1) {
        selectedCategoriesIDs.push(filter.value);
      }
    });

    $scope.isActive = function(category) {
      return selectedCategoriesIDs.indexOf(category.id) !== -1;
    };

    $scope.updateCategory = function(category) {
      var index = selectedCategoriesIDs.indexOf(category.id);
      if(index === -1) {
        selectedCategoriesIDs.push(category.id);
      } else {
        selectedCategoriesIDs.splice(index, 1);
      }
    };

    $scope.save = function() {
      _.each(selectedCategoriesIDs, function(ID){
        var category = _.where($scope.categories, { 'id': ID })[0];

        if(!_.any($scope.activeAdvancedFilters, function(filter){
          return filter.type == 'categories' && filter.value == category.id;
        })) {
          var filter = {
            title: 'Categoria',
            type: 'categories',
            desc: category.title,
            value: category.id
          };

          $scope.activeAdvancedFilters.push(filter);
        }
      });

      _.each($scope.activeAdvancedFilters, function(filter, index){
        if(filter && filter.type == 'categories' && selectedCategoriesIDs.indexOf(filter.value) === -1) {
          $scope.activeAdvancedFilters.splice(index, 1);
        }
      });

      $modalInstance.close();
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
