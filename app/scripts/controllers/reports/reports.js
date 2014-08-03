'use strict';

angular.module('zupPainelApp')

.controller('ReportsCtrl', function ($scope, Restangular, $modal, $q, isMap, AdvancedFilters, $location, $window, categoriesResponse, $cookies) {
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

    // map options
    $scope.position = null;
    $scope.selectedAreas = [];
    $scope.zoom = null;
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
    var url = Restangular.one('search').all('reports').all('items'), options = { page: page, per_page: perPage }; // jshint ignore:line

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
      var beginDate = new Date($scope.beginDate);

      options.begin_date = beginDate.toISOString(); // jshint ignore:line
    }

    if ($scope.endDate !== null)
    {
      var endDate = new Date($scope.endDate);

      options.end_date = endDate.toISOString(); // jshint ignore:line
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

    return url.getList(options);
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
      }

      var reportsPromise = generateReportsPromise();

      reportsPromise.then(function(response) {
        if (paginate !== true)
        {
          $scope.reports = response.data;
        }
        else
        {
          if (typeof $scope.reports === 'undefined')
          {
            $scope.reports = [];
          }

          for (var i = 0; i < response.data.length; i++) {
            $scope.reports.push(response.data[i]);
          }

          // add up one page
          page++;
        }

        total = parseInt(response.headers().total);

        var lastPage = Math.ceil(total / perPage);

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

  // merge all categories statuses in one array with no duplicates
  for (var i = $scope.categories.length - 1; i >= 0; i--) {
    for (var j = $scope.categories[i].statuses.length - 1; j >= 0; j--) {
      var found = false;

      for (var k = $scope.statuses.length - 1; k >= 0; k--) {
        if ($scope.statuses[k].id === $scope.categories[i].statuses[j].id)
        {
          found = true;
        }
      }

      if (!found)
      {
        $scope.statuses.push($scope.categories[i].statuses[j]);
      }
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
      templateUrl: 'views/reports/items/remove.html',
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
            $scope.showMessage('ok', 'O Relato ' + $scope.report.protocol + ' foi removido com sucesso', 'success', true);

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

  $scope.editReportStatus = function (report, category) {
    $modal.open({
      templateUrl: 'views/reports/editReportStatus.html',
      windowClass: 'editStatusModal',
      resolve: {
        report: function() {
          return report;
        },

        category: function() {
          return category;
        }
      },
      controller: ['$scope', '$modalInstance', 'category', 'report', function($scope, $modalInstance, category, report) {
        $scope.category = category;
        $scope.report = report;

        $scope.changeStatus = function(statusId) {
          $scope.report.status_id = statusId; // jshint ignore:line
        };

        $scope.save = function() {
          var changeStatusPromise = Restangular.one('reports', $scope.category.id).one('items', $scope.report.id).customPUT({ 'status_id': $scope.report.status_id }); // jshint ignore:line

          changeStatusPromise.then(function() {
            $modalInstance.close();
          });
        };

        $scope.close = function() {
          $modalInstance.close();
        };
      }]
    });
  };
});
