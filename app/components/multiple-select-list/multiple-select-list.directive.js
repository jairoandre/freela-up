'use strict';

angular
  .module('MultipleSelectListComponentModule', [])

  .directive('multipleSelectList', function () {
    return {
        restrict: 'E',
        templateUrl: "components/multiple-select-list/multiple-select-list.template.html",
        transclude: true,
        scope: {
          ngModel: '=',
          singularObjectName: '@',
          pluralObjectName: '@'
        },
        replace: true,
        controller: function ($scope) {

          $scope.selectAll = function(objects, key) {
            for (var i = objects.length - 1; i >= 0; i--) {
              var x = false;

              for (var j = 0 ; j < $scope.ngModel.length; j++) {
                if ($scope.ngModel[j] == objects[i][key])
                {
                  x = true;
                }
              };

              if (!x) $scope.ngModel.push(objects[i][key]);
            };
          };

          if (!_.isArray($scope.ngModel)) $scope.ngModel = [];

          $scope.getExcerpt = function() {
            switch ($scope.ngModel.length)
            {
              case 0:
                return 'Selecione uma ' + (_.isUndefined($scope.singularObjectName) ? 'categoria' : $scope.singularObjectName);
              break;

              case 1:
                return '1 ' + (_.isUndefined($scope.singularObjectName) ? 'categoria' : $scope.singularObjectName) + ' selecionado';

              default:
                return $scope.ngModel.length + ' ' + (_.isUndefined($scope.pluralObjectName) ? 'categorias' : $scope.pluralObjectName) + ' selecionadas';
            }
          };

          $scope.toggle = function(option) {
            var i = $scope.ngModel.indexOf(option);

            if (~i)
            {
              $scope.ngModel.splice(i, 1);


              return;
            }

            $scope.ngModel.push(option);
          };

          $scope.isSelected = function(option) {
            var i = $scope.ngModel.indexOf(option);

            if (!~i) return false;

            return true;
          };

        }
    };
  });
