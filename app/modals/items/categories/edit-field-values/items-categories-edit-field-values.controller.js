'use strict';

angular
  .module('ItemsCategoriesEditFieldValuesModalControllerModule', [
    'InventorySingleValueComponentModule'
  ])

  .controller('ItemsCategoriesEditFieldValuesModalController', function($scope, $modalInstance, field) {
    $scope.field = field;
    $scope.value = {importing: false};

    $scope.toggleImport = function() {
      if ($scope.value.importing === true)
      {
        $scope.value.importing = false;
      }
      else
      {
        $scope.value.importing = true;
      }
    };

    $scope.newValue = function() {
      if ($scope.value.importing === true)
      {
        var newValues = $scope.value.multipleOptionsText.split(/\n/);

        field.available_values = field.available_values.concat(newValues);

        $scope.value.multipleOptionsText = null;
      }
      else
      {
        field.available_values.push($scope.value.text);
      }

      $scope.value.text = null;
    };

    $scope.clear = function() {
      field.available_values = [];
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
