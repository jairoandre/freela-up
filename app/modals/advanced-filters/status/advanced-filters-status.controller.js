'use strict';

angular
  .module('AdvancedFiltersStatusModalControllerModule', [])
  .controller('AdvancedFiltersStatusModalController', function($scope, $modalInstance, categories, statuses, activeAdvancedFilters) {
    $scope.categories = categories;
    $scope.statuses = statuses;

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
      var statuses = {};

      for (var i = $scope.categories.length - 1; i >= 0; i--) {
        for (var j = $scope.categories[i].statuses.length - 1; j >= 0; j--) {
          if ($scope.categories[i].statuses[j].selected === true)
          {
            statuses[$scope.categories[i].statuses[j].id] = $scope.categories[i].statuses[j];
          }
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

      $modalInstance.close();
    };

    $scope.close = function() {
      $modalInstance.close();
    }; // hello
  });
