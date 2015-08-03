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

        //var promise = ReportsItemsService.fetchAll(fetchOptions);
        var promise = (function() {
          var defered = $q.defer();
          defered.resolve([
            {
              protocol: 1,
              title: "Nome da Notificação",
              address: "Logradouro",
              overdue_at: new Date(),
              default_deadline_in_days: Math.ceil( Math.random() * 100 * Math.abs( Math.log( Math.random() ) ) ),
              days_to_deadline: Math.ceil( Math.random() * 100 * Math.abs( Math.log( Math.random() ) ) ),
              user_id: Math.ceil( Math.random() * 1000 * Math.abs( Math.log( Math.random() ) ) ),
              reports_category_id: Math.ceil( Math.random() * 1000 * Math.abs( Math.log( Math.random() ) ) )
            },{
              protocol: 2,
              title: "Nome da Notificação",
              address: "Logradouro",
              overdue_at: new Date(),
              default_deadline_in_days: Math.ceil( Math.random() * 100 * Math.abs( Math.log( Math.random() ) ) ),
              days_to_deadline: Math.ceil( Math.random() * 100 * Math.abs( Math.log( Math.random() ) ) ),
              user_id: Math.ceil( Math.random() * 1000 * Math.abs( Math.log( Math.random() ) ) ),
              reports_category_id: Math.ceil( Math.random() * 1000 * Math.abs( Math.log( Math.random() ) ) )
            },{
              protocol: 3,
              title: "Nome da Notificação",
              address: "Logradouro",
              overdue_at: new Date(),
              default_deadline_in_days: Math.ceil( Math.random() * 100 * Math.abs( Math.log( Math.random() ) ) ),
              days_to_deadline: Math.ceil( Math.random() * 100 * Math.abs( Math.log( Math.random() ) ) ),
              user_id: Math.ceil( Math.random() * 1000 * Math.abs( Math.log( Math.random() ) ) ),
              reports_category_id: Math.ceil( Math.random() * 1000 * Math.abs( Math.log( Math.random() ) ) )
            },{
              protocol: 4,
              title: "Nome da Notificação",
              address: "Logradouro",
              overdue_at: new Date(),
              default_deadline_in_days: Math.ceil( Math.random() * 100 * Math.abs( Math.log( Math.random() ) ) ),
              days_to_deadline: Math.ceil( Math.random() * 100 * Math.abs( Math.log( Math.random() ) ) ),
              user_id: Math.ceil( Math.random() * 1000 * Math.abs( Math.log( Math.random() ) ) ),
              reports_category_id: Math.ceil( Math.random() * 1000 * Math.abs( Math.log( Math.random() ) ) )
            },{
              protocol: 5,
              title: "Nome da Notificação",
              address: "Logradouro",
              overdue_at: new Date(),
              default_deadline_in_days: Math.ceil( Math.random() * 100 * Math.abs( Math.log( Math.random() ) ) ),
              days_to_deadline: Math.ceil( Math.random() * 100 * Math.abs( Math.log( Math.random() ) ) ),
              user_id: Math.ceil( Math.random() * 1000 * Math.abs( Math.log( Math.random() ) ) ),
              reports_category_id: Math.ceil( Math.random() * 1000 * Math.abs( Math.log( Math.random() ) ) )
            }
          ]);

          return defered.promise;
        })();

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

    $scope.$on('$destroy', function () {
      $log.info('ReportsIndexNotificationsController destroyed.');
    });
  });
