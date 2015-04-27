'use strict';

angular
  .module('SelectListComponentModule', [])

  .directive('selectList', function () {
    return {
        restrict: 'E',
        templateUrl: "components/select-list/select-list.template.html",
        transclude: true,
        scope: {
          ngModel: '='
        },
        replace: true,
        controller: function ($scope) {

          $scope.select = function(option) {
            $scope.ngModel = option;
          };

          $scope.isSelected = function(option) {
            if (option === $scope.ngModel) return true;

            return false;
          };

        }
    };
  });
