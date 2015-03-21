'use strict';

angular
  .module('ReportsCategoriesIndexControllerModule', [
    'ReportsCategoriesDestroyModalControllerModule'
  ])

  .controller('ReportsCategoriesIndexController', function ($scope, Restangular, $modal) {
    $scope.loading = true;

    var categoriesPromise = Restangular.one('reports').all('categories').getList({ 'subcategories_flat': true, 'return_fields': ['id', 'title', 'parent_id', 'icon'].join() });

    categoriesPromise.then(function(response) {
      var categories = Restangular.stripRestangular(response.data), nestedCategories = [];

      _.each(categories, function(category) {
        if (category.parent_id !== null)
        {
          var parentIndex = categories.indexOf(_.findWhere(categories, { id: category.parent_id }));

          if (parentIndex === -1) return false;

          var ownIndex = categories.indexOf(category);

          if (_.isUndefined(categories[parentIndex].subcategories))
          {
            categories[parentIndex].subcategories = [category];
          }
          else
          {
            categories[parentIndex].subcategories.push(category);
          }

          categories[ownIndex] = undefined;
        }
      });

      // since we defined every subcategory as undefined, let's clean it up :)
      categories = _.without(categories, undefined);

      $scope.categories = categories;

      $scope.loading = false;
    });

    $scope.deleteCategory = function (category) {
      $modal.open({
        templateUrl: 'modals/reports/categories/destroy/reports-categories-destroy.template.html',
        windowClass: 'removeModal',
        resolve: {
          destroyCategory: function(){
            return function(category) {
              $scope.categories.splice($scope.categories.indexOf(category), 1);
            }
          },

          category: function() {
            return category;
          }
        },
        controller: 'ReportsCategoriesDestroyModalController'
      });
    };
  });
