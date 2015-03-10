'use strict';

angular
  .module('ItemsCategoriesEditFieldValuesModalControllerModule', [
    'InventorySingleValueComponentModule'
  ])

  .controller('ItemsCategoriesEditFieldValuesModalController', function($scope, $modalInstance, field, Restangular, setFieldOptions) {
    $scope.field = angular.copy(field);
    $scope.value = {importing: false};

    $scope.isExistingField = typeof $scope.field.id !== 'undefined' && $scope.field.id;

    if ($scope.field.field_options === null)
    {
      $scope.field.field_options = [];
    }

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

    var createField = function(values) {
      return Restangular.all('inventory').one('fields', field.id).post('options', values);
    };

    $scope.newValue = function() {
      if ($scope.loadingValue)
      {
        return;
      }

      $scope.loadingValue = true;

      if ($scope.isExistingField)
      {
        if ($scope.value.importing === true)
        {
          var newValues = $scope.value.multipleOptionsText.split(/\n/), fieldToBeCreated = [];

          for (var i = newValues.length - 1; i >= 0; i--) {
            fieldToBeCreated.push({ value: newValues[i] });
          };

          createField(fieldToBeCreated).then(function(response) {
            $scope.loadingValue = false;

            $scope.field.field_options.concat(response.data);
          });
        }
        else
        {
          createField({ value: $scope.value.text }).then(function(response) {
            $scope.loadingValue = false;

            $scope.field.field_options.push(response.data);
          });
        }
      }
      else
      {
        if ($scope.value.importing === true)
        {
          var newValues = $scope.value.multipleOptionsText.split(/\n/);

          for (var i = newValues.length - 1; i >= 0; i--) {
            $scope.field.field_options.push({ value: newValues[i] });
          };
        }
        else
        {
          $scope.loadingValue = false;

          $scope.field.field_options.push({ value: $scope.value.text });
        }
      }

      $scope.value.multipleOptionsText = null;
      $scope.value.text = null;
    };

    $scope.clear = function() {
      $scope.field.field_options = [];

      setFieldOptions([]);
    };

    $scope.close = function() {
      $modalInstance.close();
    };

    $scope.save = function() {
      setFieldOptions($scope.field.field_options);

      $modalInstance.close();

    };
  });
