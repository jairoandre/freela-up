'use strict';

angular
  .module('MultipleSelectListComponentModule', [])

  .directive('multipleSelectList', function () {
    return {
        restrict: 'E',
        templateUrl: "components/multiple-select-list/multiple-select-list.template.html",
        scope: {
          ngModel : '=',
        },
        transclude: true,
        controller: function ($scope) {

          if (!_.isArray($scope.ngModel)) $scope.ngModel = [];

          $scope.getExcerpt = function() {
            switch ($scope.ngModel.length)
            {
              case 0:
                return 'Selecione uma categoria';
              break;

              case 1:
                return '1 objeto selecionada';

              default:
                return $scope.ngModel.length + ' objetos selecionadas';
            }
          };

        }
    };
  });
