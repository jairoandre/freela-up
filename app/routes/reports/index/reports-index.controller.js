'use strict';

angular
  .module('ReportsIndexControllerModule', [
    'ReportsDestroyModalControllerModule',
    'OnFocusComponentModule',
    'OnBlurComponentModule',
    'AdvancedFiltersServiceModule'
  ])

  .controller('ReportsIndexController', function ($scope, Restangular, $modal, $q, isMap, AdvancedFilters, $location, $window, categoriesResponse, $cookies, FullResponseRestangular) {
    $scope.loading = true;

    var page = 1, perPage = 30, total;

    $scope.loadingPagination = false;
    $scope.filtersHash = null;

    // Basic filters
    var resetFilters = function() {
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

    // sorting the tables
    $scope.sort = {
      column: '',
      descending: false
    };

    $scope.changeSorting = function (column) {
      var sort = $scope.sort;
      if (sort.column === column) {
        sort.descending = !sort.descending;
      } else {
        sort.column = column;
        sort.descending = false;
      }
    };

    $scope.selectedCls = function (column) {
      return column === $scope.sort.column && 'sort-' + $scope.sort.descending;
    };

    // Advanced filters
    //$scope.advancedSearch = true;

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

    $scope.$watch('activeAdvancedFilters', function() {
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
          $scope.selectedCategories.push(filter.value);
        }

        if (filter.type === 'statuses')
        {
          $scope.selectedStatuses.push(filter.value);
        }

        if (filter.type === 'authors')
        {
          $scope.selectedUsers.push(filter.value);
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
          $scope.selectedAreas.push(filter.value);
        }

        if (filter.type === 'overdueOnly')
        {
          $scope.overdueOnly = true;
        }
      }

      loadFilters();
    }, true);

    if (typeof $cookies.reportsFiltersHash !== 'undefined')
    {
      $scope.activeAdvancedFilters = JSON.parse($window.atob($cookies.reportsFiltersHash));
    }

    if (typeof $location.search().filters !== 'undefined')
    {
      $scope.filtersHash = $location.search().filters;
      $scope.activeAdvancedFilters = JSON.parse($window.atob($scope.filtersHash));
    }

    // Return right promise
    var generateReportsPromise = function() {
      var url = FullResponseRestangular.one('search').all('reports').all('items'), options = { }; // jshint ignore:line

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

      // check if we have statuses selected
      if ($scope.selectedUsers.length !== 0)
      {
        options.users_ids = $scope.selectedUsers.join(); // jshint ignore:line
      }

      if ($scope.beginDate !== null)
      {
        options.begin_date = $scope.beginDate; // jshint ignore:line
      }

      if ($scope.endDate !== null)
      {
        options.end_date = $scope.endDate; // jshint ignore:line
      }

      // map options
      if ($scope.selectedAreas.length === 0 && $scope.position !== null)
      {
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

      if ($scope.zoom !== null)
      {
        options.zoom = $scope.zoom;
      }

      if ($scope.clusterize !== null)
      {
        options.clusterize = true;
      }

      if ($scope.overdueOnly !== null)
      {
        options.overdue = $scope.overdueOnly;
      }

      return url.customGET(null, options);
    };

    // One every change of page or search, we create generate a new request based on current values
    var getData = $scope.getData = function(paginate, mapOptions) {
      if ($scope.loadingPagination === false)
      {
        $scope.loadingPagination = true;

        if (typeof mapOptions !== 'undefined')
        {
          $scope.position = mapOptions.position;
          $scope.zoom = mapOptions.zoom;
          $scope.clusterize = mapOptions.clusterize;
        }

        var reportsPromise = generateReportsPromise();

        reportsPromise.then(function(response) {
          if (paginate !== true)
          {
            $scope.reports = response.data.reports;
          }
          else
          {
            if (typeof $scope.reports === 'undefined')
            {
              $scope.reports = [];
            }

            for (var i = 0; i < response.data.reports.length; i++) {
              $scope.reports.push(response.data.reports[i]);
            }

            // add up one page
            page++;
          }

          $scope.total = parseInt(response.headers().total);

          var lastPage = Math.ceil($scope.total / perPage);

          if (page === (lastPage + 1))
          {
            $scope.loadingPagination = null;
          }
          else
          {
            $scope.loadingPagination = false;
          }

          $scope.loading = false;
        });

        return reportsPromise;
      }
    };

    // create statuses array
    $scope.categories = categoriesResponse.data;
    $scope.statuses = [];

    var findStatusesInCategory = function(category) {
      for (var j = category.statuses.length - 1; j >= 0; j--) {
        var found = false;

        for (var k = $scope.statuses.length - 1; k >= 0; k--) {
          if ($scope.statuses[k].id === category.statuses[j].id)
          {
            found = true;
          }
        }

        if (!found)
        {
          $scope.statuses.push(category.statuses[j]);
        }
      }
    };

    // merge all categories statuses in one array with no duplicates
    for (var i = $scope.categories.length - 1; i >= 0; i--) {

      findStatusesInCategory($scope.categories[i]);

      if ($scope.categories[i].subcategories.length !== 0)
      {
        for (var j = $scope.categories[i].subcategories.length - 1; j >= 0; j--) {
          findStatusesInCategory($scope.categories[i].subcategories[j]);
        };
      }
    }

    var loadFilters = $scope.reload = function(reloading) {
      if (!isMap)
      {
        // reset pagination
        page = 1;
        $scope.loadingPagination = false;

        if (reloading === true)
        {
          $scope.reloading = true;
        }

        $scope.loadingContent = true;
        $scope.reports = [];

        getData().then(function() {
          $scope.loadingContent = false;

          if (reloading === true)
          {
            $scope.reloading = false;
          }

          page++;
        });
      }
      else
      {
        $scope.$broadcast('updateMap', true);
      }
    };

    $scope.removeFilter = function(filter) {
      $scope.activeAdvancedFilters.splice($scope.activeAdvancedFilters.indexOf(filter), 1);
    };

    $scope.resetFilters = function() {
      $scope.activeAdvancedFilters = [];

      if (isMap) $scope.$broadcast('updateMap', true);
    };

    $scope.loadFilter = function(status) {
      if (status === 'query')
      {
        AdvancedFilters.query($scope.activeAdvancedFilters);
      }

      if (status === 'category')
      {
        AdvancedFilters.category($scope.categories, $scope.activeAdvancedFilters);
      }

      if (status === 'status')
      {
        AdvancedFilters.status($scope.categories, $scope.statuses, $scope.activeAdvancedFilters);
      }

      if (status === 'author')
      {
        AdvancedFilters.author($scope.activeAdvancedFilters);
      }
      if (status === 'date')
      {
        AdvancedFilters.period($scope.activeAdvancedFilters);
      }

      if (status === 'area')
      {
        AdvancedFilters.area($scope.activeAdvancedFilters);
      }

      if (status === 'overdueOnly')
      {
        var overdueFilter = {
          title: 'Atraso',
          type: 'overdueOnly',
          desc: 'Apenas relatos atrasados'
        };

        $scope.activeAdvancedFilters.push(overdueFilter);
      }
    };

    // Search function
    $scope.search = function(text) {
      $scope.searchText = text;

      loadFilters();
    };

    $scope.getReportCategory = function(id) {
      for (var i = $scope.categories.length - 1; i >= 0; i--) {
        if ($scope.categories[i].id === id)
        {
          return $scope.categories[i];
        }

        if ($scope.categories[i].subcategories.length !== 0)
        {
          for (var j = $scope.categories[i].subcategories.length - 1; j >= 0; j--) {
            if ($scope.categories[i].subcategories[j].id === id)
            {
              return $scope.categories[i].subcategories[j];
            }
          };
        }
      }

      return null;
    };

    $scope.share = function () {
      AdvancedFilters.share();
    };

    $scope.changeToMap = function() {
      if ($scope.filtersHash !== null)
      {
        $location.url('/reports/map?filters=' + $scope.filtersHash);
      }
      else
      {
        $location.url('/reports/map');
      }
    };

    $scope.changeToList = function() {
      if ($scope.filtersHash !== null)
      {
        $location.url('/reports?filters=' + $scope.filtersHash);
      }
      else
      {
        $location.url('/reports');
      }
    };

    $scope.deleteReport = function (report) {
      $modal.open({
        templateUrl: 'modals/reports/destroy/reports-destroy.template.html',
        windowClass: 'removeModal',
        resolve: {
          removeReportFromList: function() {
            return function(report) {
              $scope.total--;
              $scope.reports.splice($scope.reports.indexOf(report), 1);
            }
          },

          report: function() {
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
          report: function() {
            return report;
          },

          category: function() {
            return category;
          }
        },
        controller: 'ReportsEditStatusModalController'
      });
    };
  });
