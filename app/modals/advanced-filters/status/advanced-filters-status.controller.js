'use strict';

angular
  .module('AdvancedFiltersStatusModalControllerModule', [
    'SlideComponent'
  ])

  .controller('AdvancedFiltersStatusModalController', function($scope, $modalInstance, categories, statuses, activeAdvancedFilters) {
    $scope.categories = [];
    $scope.statuses = angular.copy(statuses);
    $scope.search = {};

    for (var i = categories.length - 1; i >= 0; i--) {
      $scope.categories.push(categories[i]);

      if (typeof categories[i].subcategories !== 'undefined' && categories[i].subcategories.length !== 0)
      {
        for (var j = categories[i].subcategories.length - 1; j >= 0; j--) {
          $scope.categories.push(categories[i].subcategories[j]);
        };
      }
    };

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
            selectedCategories.push($scope.categories[i]);
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

      for (var i = selectedCategories.length - 1; i >= 0; i--) {
        var filter = {
          title: 'Categoria',
          type: 'categories',
          desc: selectedCategories[i].title,
          value: selectedCategories[i].id
        };

        activeAdvancedFilters.push(filter);
      }

      $modalInstance.close();
    };

    $scope.close = function() {
      $modalInstance.close();
    }; // hello
  });
