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

  .controller('ReportsIndexController', function ($rootScope, $scope, Restangular, $modal, $q, isMap, AdvancedFilters, $location, $window, $cookies, ReportsItemsService, $state, $log) {

    $log.info('ReportsIndexController created.');

    $scope.loading = true;
    $rootScope.uiHasScroll = true;

    var page = 1, perPage = 15;

    $scope.loadingPagination = false;
    $scope.filtersHash = null;
    $scope.categories = {};
    $scope.categoriesStatuses = {};
    $scope.total = 0;
    $scope.reports = [];

    // Basic filters
    var resetFilters = function () {
      $scope.selectedCategories = [];
      $scope.selectedStatuses = [];
      $scope.selectedUsers = [];
      $scope.selectedReporters = [];
      $scope.beginDate = null;
      $scope.endDate = null;
      $scope.searchText = null;
      $scope.overdueOnly = null;
      $scope.assignedToMyGroup = null;
      $scope.assignedToMe = null;

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
      {name: 'Relatados por...', action: 'reporter'},
      {name: 'Por período...', action: 'date'},
      {name: 'Por perímetro...', action: 'area'},
      {name: 'Apenas relatos atrasados...', action: 'overdueOnly'},
      {name: 'Associados ao meu grupo...', action: 'assignedToMyGroup'},
      {name: 'Associados à mim...', action: 'assignedToMe'},
    ];

    $scope.activeAdvancedFilters = [];

    if (typeof $cookies.reportsFiltersHash !== 'undefined')
    {
      $scope.activeAdvancedFilters = JSON.parse($window.atob($cookies.reportsFiltersHash));
    }

    if (typeof $location.search().filters !== 'undefined')
    {
      $scope.filtersHash = $location.search().filters;
      $scope.activeAdvancedFilters = JSON.parse($window.atob($scope.filtersHash));
    }

    var pushUnique = function(arr, val) {
      if(arr.indexOf(val) === -1) {
        arr.push(val)
      }
    };

    // Entrypoint / Fires initial load
    $scope.$watch('activeAdvancedFilters', function () {
      resetFilters();

      // save filters into hash
      if ($scope.activeAdvancedFilters.length !== 0)
      {
        $scope.filtersHash = $window.btoa(JSON.stringify($scope.activeAdvancedFilters));

        $location.search('filters', $scope.filtersHash);

        $cookies.reportsFiltersHash = $scope.filtersHash;
      }
      else
      {
        $scope.filtersHash = null;

        $location.search('filters', null);

        delete $cookies.reportsFiltersHash;
      }

      for (var i = $scope.activeAdvancedFilters.length - 1; i >= 0; i--) {
        var filter = $scope.activeAdvancedFilters[i];

        if (filter.type === 'query')
        {
          $scope.searchText = filter.value;
        }

        if (filter.type === 'categories')
        {
          pushUnique($scope.selectedCategories, filter.value);
        }

        if (filter.type === 'statuses')
        {
          pushUnique($scope.selectedStatuses, filter.value);
        }

        if (filter.type === 'authors') {
          pushUnique($scope.selectedUsers, filter.value);
        }

        if (filter.type === 'reporters') {
          pushUnique($scope.selectedReporters, filter.value);
        }

        if (filter.type === 'beginDate')
        {
          $scope.beginDate = filter.value;
        }

        if (filter.type === 'endDate')
        {
          $scope.endDate = filter.value;
        }

        if (filter.type === 'area')
        {
          pushUnique($scope.selectedAreas, filter.value);
        }

        if (filter.type === 'overdueOnly')
        {
          $scope.overdueOnly = true;
        }

        if (filter.type === 'assignedToMyGroup')
        {
          $scope.assignedToMyGroup = true;
        }

        if (filter.type === 'assignedToMe')
        {
          $scope.assignedToMe = true;
        }
      }

      loadFilters();
    }, true);

    // Return right promise
    $scope.generateReportsFetchingOptions = function () {
      var options = {};

      if (!$scope.position)
      {
        options.page = page;
        options.per_page = perPage;
      }

      // if we searching, hit search/users
      if ($scope.searchText !== null)
      {
        options.query = $scope.searchText;
      }

      // check if we have categories selected
      if ($scope.selectedCategories.length !== 0)
      {
        options.reports_categories_ids = $scope.selectedCategories.join(); // jshint ignore:line
      }

      // check if we have statuses selected
      if ($scope.selectedStatuses.length !== 0)
      {
        options.statuses_ids = $scope.selectedStatuses.join(); // jshint ignore:line
      }

      // check if we have users selected
      if ($scope.selectedUsers.length !== 0)
      {
        options.users_ids = $scope.selectedUsers.join(); // jshint ignore:line
      }

      // check if we have reporters
      if ($scope.selectedReporters.length !== 0)
      {
        options.reporters_ids = $scope.selectedReporters.join(); // jshint ignore:line
      }

      if ($scope.beginDate !== null)
      {
        options.begin_date = $scope.beginDate; // jshint ignore:line
      }

      if ($scope.endDate !== null)
      {
        options.end_date = $scope.endDate; // jshint ignore:line
      }

      if ($scope.sort.column !== '')
      {
        options.sort = $scope.sort.column;
        options.order = $scope.sort.descending ? 'desc' : 'asc';
      }

      // map options
      if ($scope.selectedAreas.length === 0 && $scope.position !== null) {
        options['position[latitude]'] = $scope.position.latitude;
        options['position[longitude]'] = $scope.position.longitude;
        options['position[distance]'] = $scope.position.distance;
      }
      else if ($scope.selectedAreas.length !== 0)
      {
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

      if ($scope.assignedToMyGroup !== null) {
        options.assigned_to_my_group = $scope.assignedToMyGroup;
      }

      if ($scope.assignedToMe !== null) {
        options.assigned_to_me = $scope.assignedToMe;
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

        var fetchOptions = $scope.generateReportsFetchingOptions();

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

    $scope.$on('reportsItemsFetching', function(){
      if(isMap) {
        $scope.loading = true;
      }
    });

    $scope.$on('reportsItemsFetched', function(){
      $scope.total = ReportsItemsService.total;
      $scope.loading = false;
    });

    var loadFilters = $scope.reload = function (reloading) {
      if (!isMap)
      {
        // reset pagination
        ReportsItemsService.resetCache();
        page = 1;
        $scope.loadingPagination = false;

        if (reloading === true)
        {
          $scope.reloading = true;
        }

        $scope.loadingContent = true;

        getData().then(function (reports) {
          $scope.loadingContent = false;
          $scope.reports = reports;

          if (reloading === true)
          {
            $scope.reloading = false;
          }
        });
      }
      else
      {
        $scope.$broadcast('mapRefreshRequested', true);
      }
    };

    $scope.$on('reports:itemRemoved', function(reportId){
      $scope.reload(true);
    });

    $scope.reloadMap = function(){
      $rootScope.$emit('mapRefreshRequested');
    };

    $scope.removeFilter = function (filter) {
      $scope.activeAdvancedFilters.splice($scope.activeAdvancedFilters.indexOf(filter), 1);
    };

    $scope.resetFilters = function () {
      $scope.activeAdvancedFilters = [];

      if (isMap) $scope.$broadcast('mapRefreshRequested', true);
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

      if (status === 'reporter') {
        AdvancedFilters.reporter($scope.activeAdvancedFilters);
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

      if (status === 'assignedToMyGroup') {
        var overdueFilter = {
          title: 'Relatos associados',
          type: 'assignedToMyGroup',
          desc: 'Ao meu grupo'
        };

        $scope.activeAdvancedFilters.push(overdueFilter);
      }

      if (status === 'assignedToMe') {
        var overdueFilter = {
          title: 'Relatos associados',
          type: 'assignedToMe',
          desc: 'À mim'
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

    $scope.openReport = function(report_id, event) {
      if(!$rootScope.loading
          && event.target.parentNode.tagName.toLowerCase() != 'a'
          && event.target.tagName.toLowerCase() != 'a'
        ) {
        $state.go('reports.show', { id: report_id });
      }
    };

    // we hide/show map debug
    $rootScope.pageHasMap = isMap;

    $scope.$on('$destroy', function() {
      $rootScope.pageHasMap = false;
      $log.info('ReportsIndexController destroyed.');
    });
  });
