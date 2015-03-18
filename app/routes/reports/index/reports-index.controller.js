'use strict';

angular
  .module('ReportsIndexControllerModule', [
    'ReportsDestroyModalControllerModule',
    'OnFocusComponentModule',
    'OnBlurComponentModule',
    'AdvancedFiltersServiceModule',
    'ReportsItemsServiceModule',
    'angular-toArrayFilter'
  ])

  .controller('ReportsIndexController', function ($rootScope, $scope, Restangular, $modal, $q, isMap, AdvancedFilters, $location, $window, $cookies, ReportsItemsService) {
    $scope.loading = true;
    $rootScope.uiHasScroll = true;

    var page = 1, perPage = 15;

    $scope.loadingPagination = false;
    $scope.filtersHash = null;
    $scope.categories = {};
    $scope.categoriesStatuses = {};
    $scope.total = 0;

    // Basic filters
    var resetFilters = function () {
      $scope.selectedCategories = [];
      $scope.selectedStatuses = [];
      $scope.selectedUsers = [];
      $scope.beginDate = null;
      $scope.endDate = null;
      $scope.searchText = null;
      $scope.overdueOnly = null;

      // map options
      $scope.position = null;
      $scope.selectedAreas = [];
      $scope.zoom = null;
      $scope.clusterize = null;
    };

    resetFilters();

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

    // Advanced filters
    $scope.availableFilters = [
      {name: 'Protocolo ou endereço contém...', action: 'query'},
      {name: 'Com as categorias...', action: 'category'},
      {name: 'Com os estados...', action: 'status'},
      {name: 'Criado pelos munícipes...', action: 'author'},
      {name: 'Por período...', action: 'date'},
      {name: 'Por perímetro...', action: 'area'},
      {name: 'Apenas relatos atrasados...', action: 'overdueOnly'},
    ];

    $scope.activeAdvancedFilters = [];

    if (typeof $cookies.reportsFiltersHash !== 'undefined') {
      $scope.activeAdvancedFilters = JSON.parse($window.atob($cookies.reportsFiltersHash));
    }

    if (typeof $location.search().filters !== 'undefined') {
      $scope.filtersHash = $location.search().filters;
      $scope.activeAdvancedFilters = JSON.parse($window.atob($scope.filtersHash));
    }

    // Entrypoint / Fires initial load
    $scope.$watch('activeAdvancedFilters', function () {
      resetFilters();

      // save filters into hash
      if ($scope.activeAdvancedFilters.length !== 0) {
        $scope.filtersHash = $window.btoa(JSON.stringify($scope.activeAdvancedFilters));
        $location.search('filters', $scope.filtersHash);
        $cookies.reportsFiltersHash = $scope.filtersHash;
      }
      else {
        $scope.filtersHash = null;
        $location.search('filters', null);
        delete $cookies.reportsFiltersHash;
      }

      for (var i = $scope.activeAdvancedFilters.length - 1; i >= 0; i--) {
        var filter = $scope.activeAdvancedFilters[i];

        if (filter.type === 'query') {
          $scope.searchText = filter.value;
        }

        if (filter.type === 'categories') {
          $scope.selectedCategories.push(filter.value);
        }

        if (filter.type === 'statuses') {
          $scope.selectedStatuses.push(filter.value);
        }

        if (filter.type === 'authors') {
          $scope.selectedUsers.push(filter.value);
        }

        if (filter.type === 'beginDate') {
          $scope.beginDate = filter.value;
        }

        if (filter.type === 'endDate') {
          $scope.endDate = filter.value;
        }

        if (filter.type === 'area') {
          $scope.selectedAreas.push(filter.value);
        }

        if (filter.type === 'overdueOnly') {
          $scope.overdueOnly = true;
        }
      }

      loadFilters();
    }, true);

    // Return right promise
    var generateReportsFetchingOptions = function () {
      var options = {};

      if (!$scope.position) {
        options.page = page;
        options.per_page = perPage;
      }

      // if we searching, hit search/users
      if ($scope.searchText !== null) {
        options.query = $scope.searchText;
      }

      // check if we have categories selected
      if ($scope.selectedCategories.length !== 0) {
        options.reports_categories_ids = $scope.selectedCategories.join(); // jshint ignore:line
      }

      // check if we have statuses selected
      if ($scope.selectedStatuses.length !== 0) {
        options.statuses_ids = $scope.selectedStatuses.join(); // jshint ignore:line
      }

      // check if we have statuses selected
      if ($scope.selectedUsers.length !== 0) {
        options.users_ids = $scope.selectedUsers.join(); // jshint ignore:line
      }

      if ($scope.beginDate !== null) {
        options.begin_date = $scope.beginDate; // jshint ignore:line
      }

      if ($scope.endDate !== null) {
        options.end_date = $scope.endDate; // jshint ignore:line
      }

      if ($scope.sort.column !== '') {
        options.sort = $scope.sort.column;
        options.order = $scope.sort.descending ? 'desc' : 'asc';
      }

      // map options
      if ($scope.selectedAreas.length === 0 && $scope.position !== null) {
        options['position[latitude]'] = $scope.position.latitude;
        options['position[longitude]'] = $scope.position.longitude;
        options['position[distance]'] = $scope.position.distance;
      }
      else if ($scope.selectedAreas.length !== 0) {
        for (var i = $scope.selectedAreas.length - 1; i >= 0; i--) {
          var latKey = 'position[' + i + '][latitude]';
          var lngKey = 'position[' + i + '][longitude]';
          var disKey = 'position[' + i + '][distance]';

          options[latKey] = $scope.selectedAreas[i].latitude;
          options[lngKey] = $scope.selectedAreas[i].longitude;
          options[disKey] = $scope.selectedAreas[i].distance;
        }
      }

      if ($scope.zoom !== null) {
        options.zoom = $scope.zoom;
      }

      if ($scope.clusterize !== null) {
        options.clusterize = true;
      }

      if ($scope.overdueOnly !== null) {
        options.overdue = $scope.overdueOnly;
      }

      return options;
    };

    // One every change of page or search, we create generate a new request based on current values
    var getData = $scope.getData = function (paginate, mapOptions) {
      if ($scope.loadingPagination === false) {
        $scope.loadingPagination = true;

        if (typeof mapOptions !== 'undefined') {
          $scope.position = mapOptions.position;
          $scope.zoom = mapOptions.zoom;
          $scope.clusterize = mapOptions.clusterize;
        }

        var promise = ReportsItemsService.fetchAll(generateReportsFetchingOptions());

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

    $rootScope.$on('reportsItemsFetched', function(){
      $scope.total = ReportsItemsService.total;
    });

    var loadFilters = $scope.reload = function (reloading) {
      if (!isMap) {
        // reset pagination
        ReportsItemsService.resetCache();
        page = 1;
        $scope.loadingPagination = false;

        if (reloading === true) {
          $scope.reloading = true;
        }

        $scope.loadingContent = true;
        $scope.reports = [];

        getData().then(function (reports) {
          $scope.loadingContent = false;
          $scope.reports = reports;

          if (reloading === true) {
            $scope.reloading = false;
          }

          page++;
        });
      }
      else {
        $scope.$broadcast('updateMap', true);
      }
    };

    $scope.removeFilter = function (filter) {
      $scope.activeAdvancedFilters.splice($scope.activeAdvancedFilters.indexOf(filter), 1);
    };

    $scope.resetFilters = function () {
      $scope.activeAdvancedFilters = [];

      if (isMap) $scope.$broadcast('updateMap', true);
    };

    $scope.loadFilter = function (status) {
      if (status === 'query') {
        AdvancedFilters.query($scope.activeAdvancedFilters);
      }

      if (status === 'category') {
        AdvancedFilters.category($scope.activeAdvancedFilters, 'reports');
      }

      if (status === 'status') {
        AdvancedFilters.status($scope.activeAdvancedFilters, 'reports');
      }

      if (status === 'author') {
        AdvancedFilters.author($scope.activeAdvancedFilters);
      }
      if (status === 'date') {
        AdvancedFilters.period($scope.activeAdvancedFilters);
      }

      if (status === 'area') {
        AdvancedFilters.area($scope.activeAdvancedFilters);
      }

      if (status === 'overdueOnly') {
        var overdueFilter = {
          title: 'Atraso',
          type: 'overdueOnly',
          desc: 'Apenas relatos atrasados'
        };

        $scope.activeAdvancedFilters.push(overdueFilter);
      }
    };

    // Search function
    $scope.search = function (text) {
      $scope.searchText = text;

      loadFilters();
    };

    $scope.share = function () {
      AdvancedFilters.share();
    };

    $scope.changeToMap = function () {
      if ($scope.filtersHash !== null) {
        $location.url('/reports/map?filters=' + $scope.filtersHash);
      }
      else {
        $location.url('/reports/map');
      }
    };

    $scope.changeToList = function () {
      if ($scope.filtersHash !== null) {
        $location.url('/reports?filters=' + $scope.filtersHash);
      }
      else {
        $location.url('/reports');
      }
    };

    $scope.deleteReport = function (report) {
      $modal.open({
        templateUrl: 'modals/reports/destroy/reports-destroy.template.html',
        windowClass: 'removeModal',
        resolve: {
          removeReportFromList: function () {
            return function (report) {
              $scope.total--;
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

    $scope.editReportStatus = function (report, category) {
      $modal.open({
        templateUrl: 'modals/reports/edit-status/reports-edit-status.template.html',
        windowClass: 'editStatusModal',
        resolve: {
          report: function () {
            return report;
          },

          category: function () {
            return category;
          }
        },
        controller: 'ReportsEditStatusModalController'
      });
    };
  });
