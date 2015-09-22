'use strict';

angular
  .module('ReportsIndexNotificationsControllerModule', [
    'ReportsDestroyModalControllerModule',
    'OnFocusComponentModule',
    'OnBlurComponentModule',
    'ReportsItemsServiceModule',
    'angular-toArrayFilter'
  ])

  .controller('ReportsIndexNotificationsController', function ($rootScope, $scope, Restangular, $modal, $q, $location, $window, $cookies, ReportsItemsService, $state, $log) {

    $log.info('ReportsIndexNotificationsController created.');

    var page = 1, perPage = 15;

    $scope.loadingPagination = false;
    $scope.$parent.total = 0;
    $scope.reports = [];

    // One every change of page or search, we create generate a new request based on current values
    var getData = $scope.getData = function () {
      if ($scope.$parent.loadingPagination === false) {
        $scope.$parent.loadingPagination = true;

        var fetchOptions = $scope.generateReportsFetchingOptions();

        fetchOptions.page = +page || 1;
        fetchOptions.per_page = +perPage || 15;

        fetchOptions.with_notifications = true;
        fetchOptions.return_fields = [
          'id', 'protocol', 'address', 'number', 'category_id', 'status_id', 'created_at', 'overdue',
          'overdue_at', 'category.title', 'user.name', 'user.id', 'last_notification'
        ].join();

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

    $scope.$on('reportsItemsFetched', function () {
      $scope.$parent.total = ReportsItemsService.total;
      $scope.$parent.loading = false;
    });

    $scope.$on('loadFilters', function (event, reloading) {
      // reset pagination
      ReportsItemsService.resetCache();
      page = 1;
      $scope.$parent.loadingPagination = false;

      if (reloading === true) {
        $scope.$parent.reloading = true;
      }

      $scope.$parent.loadingContent = true;

      getData().then(function (reports) {
        $scope.$parent.loadingContent = false;
        $scope.reports = reports;

        if (reloading === true) {
          $scope.$parent.reloading = false;
        }
      });
    });

    function abs(days){
      return Math.abs(days);
    };

    $scope.getDaysTxt = function(days) {
      return days < 0 ?  (abs(days) + ' dia' + (days === -1 ? '' : 's') + ' atrás') : (days + ' dia' + (days === 1 ? '' : 's') );
    };

    $scope.$on('$destroy', function () {
      $log.info('ReportsIndexNotificationsController destroyed.');
    });
  });
