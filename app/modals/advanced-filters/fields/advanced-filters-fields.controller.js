'use strict';

angular
  .module('AdvancedFiltersFieldsModalControllerModule', [
    'FieldsFilterItemComponentModule'
  ])
  .controller('AdvancedFiltersFieldsModalController', function($scope, $modalInstance, activeAdvancedFilters, categories) {
    $scope.categories = categories;
    $scope.activeAdvancedFilters = activeAdvancedFilters;

    $scope.items = [];

    $scope.methods = [
      { condition: 'greater_than', text: 'Maior que', availableKinds: ['text', 'integer', 'decimal', 'meters', 'centimeters', 'kilometers', 'years', 'months', 'days', 'hours', 'seconds', 'angle'] },
      { condition: 'lesser_than', text: 'Menor que', availableKinds: ['text', 'integer', 'decimal', 'meters', 'centimeters', 'kilometers', 'years', 'months', 'days', 'hours', 'seconds', 'angle'] },
      { condition: 'equal_to', text: 'Igual a', availableKinds: ['text', 'integer', 'decimal', 'checkbox', 'radio', 'select', 'meters', 'centimeters', 'kilometers', 'years', 'months', 'days', 'hours', 'seconds', 'angle', 'date', 'time', 'cpf', 'cnpj', 'url', 'email'] },
      { condition: 'different', text: 'Diferente de', availableKinds: ['text', 'integer', 'decimal', 'checkbox', 'radio', 'select', 'meters', 'centimeters', 'kilometers', 'years', 'months', 'days', 'hours', 'seconds', 'angle', 'date', 'time', 'cpf', 'cnpj', 'url', 'email'] },
      { condition: 'like', text: 'Parecido com', availableKinds: ['text', 'integer', 'decimal', 'meters', 'centimeters', 'kilometers', 'years', 'months', 'days', 'hours', 'seconds', 'angle', 'date', 'time', 'cpf', 'cnpj', 'url', 'email'] },
      { condition: 'includes', text: 'Inclui', availableKinds: ['checkbox', 'radio', 'select'] },
      { condition: 'excludes', text: 'Não inclui', availableKinds: ['checkbox', 'radio', 'select'] },
    ];

    $scope.newField = {
      category: null,
      condition: null,
      field: null,
      value: null
    };

    $scope.selectCategory = function(category) {
      // create array just with fields
      category.fields = [];

      for (var i = category.sections.length - 1; i >= 0; i--) {
        for (var j = category.sections[i].fields.length - 1; j >= 0; j--) {
          category.fields.push(category.sections[i].fields[j]);
        }
      }

      $scope.newField.category = category;
      $scope.newField.condition = null;
      $scope.newField.field = null;
      $scope.newField.value = null;
      $scope.newField.fieldId = null;
    };

    $scope.selectCondition = function(condition) {
      $scope.newField.condition = condition;
    };

    $scope.$watch('newField.fieldId', function() {
      if ($scope.newField.category !== null && $scope.newField.fieldId !== null)
      {
        for (var i = $scope.newField.category.fields.length - 1; i >= 0; i--) {
          if ($scope.newField.category.fields[i].id == $scope.newField.fieldId)
          {
            $scope.newField.field = $scope.newField.category.fields[i];

            $scope.selectCondition(null);
          }
        };
      }
    });

    $scope.selectField = function(field) {
      $scope.newField.field = field;
    };

    $scope.addItem = function() {
      $scope.items.push(angular.copy($scope.newField));
    };

    $scope.save = function() {
      for (var i = $scope.items.length - 1; i >= 0; i--) {
        var filter = {
          title: 'Campo',
          type: 'fields',
          desc: $scope.items[i].field.label + ': ' + $scope.items[i].condition.text + ' ' + $scope.items[i].value,
          value: {id: $scope.items[i].field.id, condition: $scope.items[i].condition.condition, value: $scope.items[i].value}
        };

        $scope.activeAdvancedFilters.push(filter);
      }

      $modalInstance.close();
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
