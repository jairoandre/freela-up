'use strict';

angular
  .module('ReportsCategoriesIndexControllerModule', [
    'ReportsCategoriesDestroyModalControllerModule',
    'ReportsCategoriesServiceModule'
  ])

  .controller('ReportsCategoriesIndexController', function ($scope, ReportsCategoriesService, $modal) {
    $scope.loading = true;

    var populateCategories = function(categories) {
      categories = angular.copy(categories);

      _.each(categories, function (category) {
        if (category.parent_id !== null) {
          var parentIndex = categories.indexOf(_.findWhere(categories, { id: category.parent_id }));

          if (parentIndex === -1) return false;

          var ownIndex = categories.indexOf(category);

          if (_.isUndefined(categories[parentIndex].subcategories)) {
            categories[parentIndex].subcategories = [category];
          }
          else {
            categories[parentIndex].subcategories.push(category);
          }

          categories[ownIndex] = undefined;
        }

        // since we defined every subcategory as undefined, let's clean it up :)
        categories = _.without(categories, undefined);

        $scope.categories = categories;

        $scope.loading = false;
      });
    };

    ReportsCategoriesService.fetchAllBasicInfo().then(function(response) {
      populateCategories(response.data.categories);
    });

    $scope.iconSeed = Math.random().toString(36).substring(7);

    $scope.deleteCategory = function (category) {
      $modal.open({
        templateUrl: 'modals/reports/categories/destroy/reports-categories-destroy.template.html',
        windowClass: 'removeModal',
        resolve: {
          destroyCategory: function(){
            return function(category) {
              $scope.categories.splice($scope.categories.indexOf(category), 1);

              // TODO we need to find index of subcategories too! :(
              // currently we are only removing parent categories :-0
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
