'use strict';

angular
  .module('SelectListComponentModule', [])

  .directive('selectList', function ($document) {
    return {
        restrict: 'E',
        templateUrl: "components/select-list/select-list.template.html",
        transclude: true,
        scope: {
          ngModel: '=',
          optionName: '@'
        },
        replace: true,
        controller: function ($scope) {
          $scope.getExcerpt = function() {
            if ($scope.title)
            {
              return $scope.title;
            }

            return 'Selecione uma categoria';
          };

          $scope.select = function(optionId, option) {
            $scope.ngModel = optionId;

            $scope.title = option[$scope.optionName];

            $scope.show = false;
            $scope.$emit('optionSelected', option);
          };

          $scope.isSelected = function(optionId) {
            if (optionId === $scope.ngModel) return true;

            return false;
          };
        },
        link: function(scope, element, attrs) {
          var windowClick = function(event) {
            if (!$(event.target).closest(element).length) {
              scope.show = false;

              scope.$apply();

              angular.element($document).off('click', windowClick);
            }
          };

          scope.toggleList = function() {
            scope.show = !scope.show;

            if (!scope.show)
            {
              angular.element($document).off('click', windowClick);
            }
            else
            {
              // we need to hide the menu if clicked anywhere else
              angular.element($document).on('click', windowClick);
            }
          };

          // we still unbind the event on scope.$destroy JUST IN CASE
          scope.$on('$destroy', function () {
            angular.element($document).off('click', windowClick);
          });
        }
    };
  });
