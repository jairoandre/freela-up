'use strict';

angular
  .module('ItemsCategoriesEditFieldValuesModalControllerModule', [
    'InventorySingleValueComponentModule'
  ])

  .controller('ItemsCategoriesEditFieldValuesModalController', function($scope, $modalInstance, field, Restangular) {
    $scope.field = angular.copy(field);
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

    var createField = function(value) {
      return Restangular.all('inventory').one('fields', field.id).post('options', { value: value });
    };

    $scope.newValue = function() {
      $scope.loadingValue = true;

      if ($scope.value.importing === true)
      {
        var newValues = $scope.value.multipleOptionsText.split(/\n/);

        $scope.field.available_values = $scope.field.available_values.concat(newValues);

        $scope.value.multipleOptionsText = null;
      }
      else
      {
        createField($scope.value.text).then(function() {
          $scope.loadingValue = false;

          $scope.field.available_values.push($scope.value.text);
        });
      }

      $scope.value.text = null;
    };

    $scope.clear = function() {
      $scope.field.available_values = [];
    };

    $scope.close = function() {
      $modalInstance.close();
    };

    $scope.save = function() {
      field.available_values = $scope.field.available_values;

      $modalInstance.close();
    };
  });
