'use strict';

angular
  .module('ReportsCategoriesIndexControllerModule', [
    'ReportsCategoriesDestroyModalControllerModule'
  ])

  .controller('ReportsCategoriesIndexController', function ($scope, Restangular, $modal) {
    $scope.loading = true;

    var categoriesPromise = Restangular.one('reports').all('categories').getList({ 'display_type': 'full' });

    categoriesPromise.then(function(response) {
      $scope.categories = response.data;

      $scope.loading = false;
    });

    $scope.deleteCategory = function (category) {
      $modal.open({
        templateUrl: 'modals/reports/categories/destroy/reports-categories-destroy.template.html',
        windowClass: 'removeModal',
        resolve: {
          reportsCategoriesList: function(){
            return $scope.categories;
          },

          category: function() {
            return category;
          }
        },
        controller: 'ReportsCategoriesDestroyModalController'
      });
    };
  });
