'use strict';

angular
  .module('ReportsIndexListControllerModule', [
    'ReportsDestroyModalControllerModule',
    'OnFocusComponentModule',
    'OnBlurComponentModule',
    'AdvancedFiltersServiceModule',
    'ReportsItemsServiceModule',
    'angular-toArrayFilter'
  ])

  .controller('ReportsIndexListController', function ($rootScope, $scope, Restangular, $modal, $q, AdvancedFilters, $location, $window, $cookies, ReportsItemsService, $state, $log) {

    $log.info('ReportsIndexListController created.');

    var page = 1, perPage = 15;

    $scope.loadingPagination = false;
    $scope.total = 0;
    $scope.reports = [];

    // One every change of page or search, we create generate a new request based on current values
    var getData = $scope.getData = function (paginate) {
      if ($scope.loadingPagination === false) {
        $scope.loadingPagination = true;

        var fetchOptions = $scope.generateReportsFetchingOptions(page, perPage);

        var promise = ReportsItemsService.fetchAll(fetchOptions);

        promise.then(function (reports) {
          page++;
          $scope.reports = reports;

          var lastPage = Math.ceil($scope.total / perPage);

          if (page === (lastPage + 1)) {
            $scope.loadingPagination = null;
          }
          else {
            $scope.loadingPagination = false;
          }

          $scope.loading = false;
        });

        return promise;
      }
    };

    $scope.$on('$destroy', function () {
      $log.info('ReportsIndexListController destroyed.');
    });
  });
