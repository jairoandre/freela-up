'use strict';

angular
  .module('ReportCategorySelectorDirectiveModule', [
    'DiacriticsInsensitiveFilterHelperModule',
    'SelectListComponentModule',
    'ReportsCategoriesServiceModule'
  ])
  .directive('reportCategorySelector', function (ReportsCategoriesService, $document, $timeout) {
    return {
      restrict: 'E',
      scope: {
        onCategorySelect: '&',
        title: '='
      },
      templateUrl: 'components/report-category-selector/report-category-selector.template.html',
      controllerAs: 'reportCategorySelectorCtrl',
      controller: function ($scope) {
        $scope.getExcerpt = function () {
          if ($scope.title) {
            return $scope.title;
          }

          return 'Selecione uma categoria';
        };

        $scope.select = function (category) {
          $scope.onCategorySelect({ category: category }); // sometimes angular is just ugly
          $scope.show = false;
        };

        $scope.loadingReportCategories = true;
        $scope.errorLoadingReportCategories = false;

        ReportsCategoriesService.fetchTitlesAndIds().then(function (categories) {
          $scope.categories = categories;
          $scope.loadingReportCategories = false;
        }, function(){
          $scope.loadingReportCategories = false;
          $scope.errorLoadingReportCategories = true;
        });
      },
      link: function ($scope, element) {
        var windowClick = function (event) {
          if (!$(event.target).closest(element).length) {
            $scope.show = false;

            $scope.$apply();

            angular.element($document).off('click', windowClick);
          }
        };

        $scope.toggleList = function () {
          $scope.show = !$scope.show;

          if (!$scope.show) {
            angular.element($document).off('click', windowClick);
          }
          else {
            angular.element($document).on('click', windowClick);
          }
        };

        $scope.$on('$destroy', function () {
          angular.element($document).off('click', windowClick);
        });
      }
    };
  });
