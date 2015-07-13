'use strict';

angular
  .module('ReportCategorySelectorDirectiveModule', ['SelectListComponentModule', 'ReportsCategoriesServiceModule'])
  .directive('reportCategorySelector', function (ReportsCategoriesService) {
    return {
      restrict: 'E',
      scope: {
        onCategorySelect: '&'
      },
      templateUrl: 'components/report-category-selector/report-category-selector.html',
      controllerAs: 'reportCategorySelectorCtrl',
      controller: function ($scope) {
        ReportsCategoriesService.fetchTitlesAndIds().then(function(categories){
          $scope.categories = categories;
        });
      }
    };
  });
