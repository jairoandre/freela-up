'use strict';

angular
  .module('FilterGroupModalControllerModule', [])

  .controller('FilterGroupModalController', function($scope, $modalInstance, groups, applyFilter, selectedGroups) {
    $scope.selectedGroupsIDs = selectedGroups;

    $scope.groups = groups;

    $scope.isActive = function(group) {
      return $scope.selectedGroupsIDs.indexOf(group.id) !== -1;
    };

    $scope.toggle = function(group) {
      var index = $scope.selectedGroupsIDs.indexOf(group.id);

      if (index === -1)
      {
        $scope.selectedGroupsIDs.push(group.id);
      }
      else
      {
        $scope.selectedGroupsIDs.splice(index, 1);
      }
    };

    $scope.confirm = function() {
      applyFilter($scope.selectedGroupsIDs);

      $modalInstance.close();
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
