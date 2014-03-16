'use strict';

angular.module('zupPainelApp')

.controller('ReportsCtrl', function ($scope, Restangular, $modal, $q) {
 $scope.loading = true;

  var page = 1, per_page = 30, total, searchText = '', loadingPagination = false;

  // Return right promise
  var generateReportsPromise = function(searchText) {
    // if we searching, hit search/users
    if (searchText != '')
    {
      return Restangular.one('search').all('items').getList({name: searchText, email: searchText, page: page, per_page: per_page});
    }

    return Restangular.one('reports').all('items').getList({ page: page, per_page: per_page });
  };

  // Get groups for filters
  var categories = Restangular.one('reports').all('categories').getList();

  // One every change of page or search, we create generate a new request based on current values
  var getData = $scope.getData = function(paginate) {
    if (loadingPagination === false)
    {
      loadingPagination = true;

      var reportsPromise = generateReportsPromise(searchText);

      $q.all([reportsPromise, categories]).then(function(responses) {
        $scope.categories = responses[1].data;

        if (paginate !== true)
        {
          $scope.reports = responses[0].data;
        }
        else
        {
          if (typeof $scope.reports == 'undefined')
          {
            $scope.reports = [];
          }

          for (var i = 0; i < responses[0].data.length; i++) {
            $scope.reports.push(responses[0].data[i]);
          };

          // add up one page
          page++;
        }

        total = parseInt(responses[0].headers().total);

        var last_page = Math.ceil(total / per_page);

        if (page === (last_page + 1))
        {
          loadingPagination = null;
        }
        else
        {
          loadingPagination = false;
        }

        $scope.loading = false;
      });

      return reportsPromise;
    }
  };

  $scope.getReportCategory = function(id) {
    for (var i = $scope.categories.length - 1; i >= 0; i--) {
      if ($scope.categories[i].id === id)
      {
        return $scope.categories[i];
      }
    }

    return null;
  };

  $scope.deleteReport = function (report) {
    $modal.open({
      templateUrl: 'views/reports/removeReport.html',
      windowClass: 'removeModal',
      resolve: {
        reportsList: function() {
          return $scope.reports;
        },

        report: function() {
          return report;
        }
      },
      controller: ['$scope', '$modalInstance', 'reportsList', 'report', function($scope, $modalInstance, reportsList, report) {
        $scope.report = report;

        // delete user from server
        $scope.confirm = function() {
          var deletePromise = Restangular.one('reports').one('items', $scope.report.id).remove();

          deletePromise.then(function() {
            $modalInstance.close();

            // remove user from list
            reportsList.splice(reportsList.indexOf($scope.report), 1);
          });
        };

        $scope.close = function() {
          $modalInstance.close();
        };
      }]
    });
  };
})

.controller('ReportsCategoriesCtrl', function ($scope, Restangular, $modal) {
  $scope.loading = true;

  var categoriesPromise = Restangular.one('reports').all('categories').getList();

  categoriesPromise.then(function(response) {
    $scope.categories = response.data;

    $scope.loading = false;
  });

  /*$scope.deleteCategory = function (category) {
    $modal.open({
      templateUrl: 'removeCategory.html',
      windowClass: 'removeModal',
      resolve: {
        reportsCategoriesList: function(){
          return $scope.categories;
        }
      },
      controller: ['$scope', '$modalInstance', 'Users', 'reportsCategoriesList', function($scope, $modalInstance, Users, reportsCategoriesList) {
        $scope.category = category;

        // delete user from server
        $scope.confirm = function() {
          Reports.delete({ id: $scope.category.id }, function() {
            $modalInstance.close();

            // remove user from list
            reportsCategoriesList.splice(reportsCategoriesList.indexOf($scope.category), 1);
          });
        };

        $scope.close = function() {
          $modalInstance.close();
        };
      }]
    });
  };*/
})

.controller('ReportsCategoriesItemCtrl', function ($scope, Restangular, $routeParams, $q) {
  $scope.loading = true;

  var reportPromise = Restangular.one('reports').one('items', $routeParams.id).get();
  var categoriesPromise = Restangular.one('reports').all('categories').getList();

  $q.all([reportPromise, categoriesPromise]).then(function(responses) {
    $scope.report = responses[0].data;

    // find category
    for (var i = responses[1].data.length - 1; i >= 0; i--) {
      if (responses[1].data[i].id == $routeParams.categoryId)
      {
        $scope.category = responses[1].data[i];
      }
    }

    $scope.loading = false;
  });
})

.controller('ReportsCategoriesEditCtrl', function ($scope, $routeParams, Restangular) {
  $scope.enabled_user_response_time = false;

  var category = $scope.category = {
    marker: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
  };

  $scope.send = function() {
    $scope.inputErrors = null;
    $scope.processingForm = true;

    var categoryPromise = Restangular.one('reports').post('categories', category);

    categoryPromise.then(function(response) {
      console.log('success', response);

      $scope.processingForm = false;
    }, function(response) {
      console.log('error', response);

      $scope.inputErrors = response.data.error;
      $scope.processingForm = false;
    });
  };
});
