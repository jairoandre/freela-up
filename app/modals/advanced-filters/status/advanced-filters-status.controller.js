'use strict';

angular
  .module('AdvancedFiltersStatusModalControllerModule', [
    'SlideComponent'
  ])

  .controller('AdvancedFiltersStatusModalController', function($scope, $rootScope, $modalInstance, activeAdvancedFilters, categoriesResponse) {
    $rootScope.resolvingRequest = false;

    // TODO Simplify this when inventory categories get its own API Client service
    var categories = typeof categoriesResponse.data !== 'undefined' ? categoriesResponse.data : categoriesResponse;

    $scope.statuses = [];

    var addStatusesFromCategory = function(category) {
      for (var j = category.statuses.length - 1; j >= 0; j--) {
        var found = false;

        for (var k = $scope.statuses.length - 1; k >= 0; k--) {
          if (!category.statuses[j].active || $scope.statuses[k].id === category.statuses[j].id)
          {
            found = true;
          }
        }

        if (!found)
        {
          $scope.statuses.push(category.statuses[j]);
        }
      }
    };

    // merge all categories statuses in one array with no duplicates
    for (var i = categories.length - 1; i >= 0; i--) {

      addStatusesFromCategory(categories[i]);

      if (typeof categories[i].subcategories !== 'undefined' && categories[i].subcategories.length !== 0)
      {
        for (var j = categories[i].subcategories.length - 1; j >= 0; j--) {
          addStatusesFromCategory(categories[i].subcategories[j]);
        }
      }
    }


    $scope.categories = [];
    $scope.search = {};

    for (var i = categories.length - 1; i >= 0; i--) {
      $scope.categories.push(categories[i]);

      if (typeof categories[i].subcategories !== 'undefined' && categories[i].subcategories.length !== 0)
      {
        for (var j = categories[i].subcategories.length - 1; j >= 0; j--) {
          $scope.categories.push(categories[i].subcategories[j]);
        }
      }
    }

    // TODO Remove after the loops above have been cleared on the InventoryItemsService refactor
    $scope.categories = _.uniq($scope.categories);

    $scope.updateStatus = function(status) {
      if (typeof status.selected === 'undefined' || status.selected === false)
      {
        status.selected = true;
      }
      else
      {
        status.selected = false;
      }
    };

    $scope.save = function() {
      var statuses = {}, selectedCategories = [];

      for (var i = $scope.categories.length - 1; i >= 0; i--) {
        for (var j = $scope.categories[i].statuses.length - 1; j >= 0; j--) {
          if ($scope.categories[i].statuses[j].selected === true)
          {
            statuses[$scope.categories[i].statuses[j].id] = $scope.categories[i].statuses[j];
            if(selectedCategories.indexOf($scope.categories[i]) === -1) {
              selectedCategories.push($scope.categories[i]);
            }
          }

          $scope.categories[i].statuses[j].selected = false;
        };
      }

      for (var x in statuses)
      {
        var filter = {
          title: 'Estado',
          type: 'statuses',
          desc: statuses[x].title,
          value: statuses[x].id
        };

        activeAdvancedFilters.push(filter);
      }

      /*for (var i = selectedCategories.length - 1; i >= 0; i--) {
        var filter = {
          title: 'Categoria',
          type: 'categories',
          desc: selectedCategories[i].title,
          value: selectedCategories[i].id
        };

        activeAdvancedFilters.push(filter);
      }*/

      $modalInstance.close();
    };

    $scope.close = function() {
      $modalInstance.close();
    }; // hello
  });
