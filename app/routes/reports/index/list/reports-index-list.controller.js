'use strict';

angular
  .module('ReportsIndexListControllerModule', [
    'ReportsDestroyModalControllerModule',
    'OnFocusComponentModule',
    'OnBlurComponentModule',
    'ReportsItemsServiceModule',
    'angular-toArrayFilter'
  ])

  .controller('ReportsIndexListController', function ($rootScope, $scope, Restangular, $modal, $q, $location, $window, $cookies, ReportsItemsService, $state, $log) {

    $log.debug('ReportsIndexListController created.');

    var page = 1, perPage = 15;

    $scope.loadingPagination = false;
    $scope.$parent.total = 0;
    $scope.reports = [];

    // sorting the tables
    $scope.sort = {
      column: 'created_at',
      descending: true
    };

    $scope.changeSorting = function (column) {
      var sort = $scope.sort;

      if (sort.column === column) {
        sort.descending = !sort.descending;
      } else {
        sort.column = column;
        sort.descending = false;
      }

      ReportsItemsService.resetCache();
      $scope.reload();
    };

    $scope.selectedCls = function (column) {
      return column === $scope.sort.column && 'sort-' + $scope.sort.descending;
    };

    $scope.deleteReport = function (report) {
      $modal.open({
        templateUrl: 'modals/reports/destroy/reports-destroy.template.html',
        windowClass: 'removeModal',
        resolve: {
          removeReportFromList: function () {
            return function (report) {
              $scope.$parent.total--;
              $scope.reports.splice($scope.reports.indexOf(report), 1);
            }
          },

          report: function () {
            return report;
          }
        },
        controller: 'ReportsDestroyModalController'
      });
    };

    // One every change of page or search, we create generate a new request based on current values
    var getData = $scope.getData = function () {
      if ($scope.$parent.loadingPagination === false) {
        $scope.$parent.loadingPagination = true;

        var fetchOptions = $scope.generateReportsFetchingOptions();

        if ($scope.sort.column !== '') {
          fetchOptions.sort = $scope.sort.column;
          fetchOptions.order = $scope.sort.descending ? 'desc' : 'asc';
        }

        fetchOptions.page = +page || 1;
        fetchOptions.per_page = +perPage || 15;

        var promise = ReportsItemsService.fetchAll(fetchOptions);

        promise.then(function (reports) {
          page++;
          $scope.reports = reports;

          var lastPage = Math.ceil($scope.total / perPage);

          if (page === (lastPage + 1)) {
            $scope.$parent.loadingPagination = null;
          } else {
            $scope.$parent.loadingPagination = false;
          }

          $scope.$parent.loading = false;
        });

        return promise;
      }
    };

    $scope.$on('reportsItemsFetched', function () {
      $scope.$parent.total = ReportsItemsService.total;
      $scope.$parent.loading = false;
    });

    $scope.$on('loadFilters', function (event, reloading) {

      // reset pagination
      ReportsItemsService.resetCache();
      page = 1;
      $scope.$parent.loadingPagination = false;

      if (reloading) {
        $scope.$parent.reloading = true;
      }

      $scope.$parent.loadingContent = true;

      getData().then(function (reports) {
        $scope.$parent.loadingContent = false;
        $scope.reports = reports;

        if (reloading) {
          $scope.$parent.reloading = false;
        }
      });
    });

    $scope.$on('$destroy', function () {
      $log.debug('ReportsIndexListController destroyed.');
    });
  });
