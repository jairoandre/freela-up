'use strict';

angular
  .module('ReportsIndexMapControllerModule', [
    'ReportsDestroyModalControllerModule',
    'OnFocusComponentModule',
    'OnBlurComponentModule',
    'AdvancedFiltersServiceModule',
    'ReportsItemsServiceModule',
    'angular-toArrayFilter'
  ])

  .controller('ReportsIndexMapController', function ($rootScope, $scope, Restangular, $modal, $q, AdvancedFilters, $location, $window, $cookies, ReportsItemsService, $state, $log) {

    $log.info('ReportsIndexMapController created.');

    $scope.reports = [];
    $scope.position = null;
    $scope.selectedAreas = [];
    $scope.zoom = null;
    $scope.clusterize = null;

    // One every change of page or search, we create generate a new request based on current values
    var getData = $scope.getData = function (paginate) {

      console.log('getData');

      if ($scope.$parent.loadingPagination === false) {
        $scope.$parent.loadingPagination = true;

        var fetchOptions = $scope.generateReportsFetchingOptions();

        var promise = ReportsItemsService.fetchAll(fetchOptions);

        promise.then(function (reports) {
          page++;
          $scope.reports = reports;

          var lastPage = Math.ceil($scope.total / perPage);

          if (page === (lastPage + 1)) {
            $scope.$parent.loadingPagination = null;
          }
          else {
            $scope.$parent.loadingPagination = false;
          }

          $scope.$parent.loading = false;
        });

        return promise;
      }
    };

    $scope.$on('reportsItemsFetching', function () {
      console.log('reportsItemsFetching');
      $scope.$parent.loading = true;
    });

    $scope.$on('reportsItemsFetched', function () {
      console.log('reportsItemsFetched');
      $scope.$parent.total = ReportsItemsService.total;
      $scope.$parent.loading = false;
    });

    $scope.$on('loadFilters', function (event, reloading) {
      console.log('loadFilters');
      $scope.$broadcast('mapRefreshRequested', true);
    });

    $scope.$on('$destroy', function () {
      $log.info('ReportsIndexMapController destroyed.');
    });
  });
