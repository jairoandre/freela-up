'use strict';

angular.module('zupPainelApp')

.controller('ReportsCtrl', function ($scope, Restangular, $modal, $q, isMap, AdvancedFilters, $location, $window) {
  $scope.loading = true;

  var page = 1, perPage = 30, total;

  $scope.loadingPagination = false;

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

  // watch for filter type changes
  $scope.$watchCollection('[advancedSearch, activeAdvancedFilters]', function() {
    resetFilters();
  });

  // Advanced filters
  //$scope.advancedSearch = true;

  $scope.availableFilters = [
    {name: 'Com as categorias...', action: 'category'},
    {name: 'Com os estados...', action: 'status'},
    {name: 'Criado pelos munícipes...', action: 'author'},
    {name: 'Por período...', action: 'date'},
    {name: 'Por perímetro...', action: 'area'},
  ];

  $scope.activeAdvancedFilters = [];

  $scope.$watch('activeAdvancedFilters', function() {
    if ($scope.advancedSearch === true)
    {
      resetFilters();

      // save filters into hash
      if ($scope.activeAdvancedFilters.length !== 0)
      {
        $location.search('filters', $window.btoa(JSON.stringify($scope.activeAdvancedFilters)));
      }
      else
      {
        $location.search('filters', null);
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
    }
  }, true);

  if (typeof $location.search().filters !== 'undefined')
  {
    $scope.advancedSearch = true;
    $scope.activeAdvancedFilters = JSON.parse($window.atob($location.search().filters));
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

  // Get groups for filters
  var categories = Restangular.one('reports').all('categories').getList({'display_type' : 'full'});

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

      $q.all([reportsPromise, categories]).then(function(responses) {
        $scope.categories = responses[1].data;

        if (paginate !== true)
        {
          $scope.reports = responses[0].data;
        }
        else
        {
          if (typeof $scope.reports === 'undefined')
          {
            $scope.reports = [];
          }

          for (var i = 0; i < responses[0].data.length; i++) {
            $scope.reports.push(responses[0].data[i]);
          }

          // add up one page
          page++;
        }

        total = parseInt(responses[0].headers().total);

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
  categories.then(function(response) {
    $scope.statuses = [];

    // merge all categories statuses in one array with no duplicates
    for (var i = response.data.length - 1; i >= 0; i--) {
      for (var j = response.data[i].statuses.length - 1; j >= 0; j--) {
        var found = false;

        for (var k = $scope.statuses.length - 1; k >= 0; k--) {
          if ($scope.statuses[k].id === response.data[i].statuses[j].id)
          {
            found = true;
          }
        }

        if (!found)
        {
          $scope.statuses.push(response.data[i].statuses[j]);
        }
      }
    }
  });

  var loadFilters = $scope.reload = function() {
    if (!isMap)
    {
      // reset pagination
      page = 1;
      $scope.loadingPagination = false;

      $scope.loadingContent = true;
      $scope.reports = [];

      getData().then(function() {
        $scope.loadingContent = false;

        page++;
      });
    }
    else
    {
      $scope.$broadcast('updateMap', true);
    }
  };

  $scope.$watchCollection('[selectedCategories, selectedStatuses, beginDate, endDate]', function() {
    loadFilters();
  });

  // We watch for changes in the advanced filter to set it's variables
  $scope.$watch('advancedSearch', function() {
    if ($scope.advancedSearch === true)
    {
      loadFilters();
    }
  });

  $scope.removeFilter = function(filter) {
    $scope.activeAdvancedFilters.splice($scope.activeAdvancedFilters.indexOf(filter), 1);
  };

  $scope.resetFilters = function() {
    $scope.activeAdvancedFilters = [];
  };

  // All available filters
  var advancedFilterQuery = function(query) {
    var filter = {
      title: 'Título ou endereço',
      desc: query,
      type: 'query',
      value: query
    };

    $scope.activeAdvancedFilters.push(filter);
  };

  $scope.loadFilter = function(status) {
    if (status === 'query')
    {
      advancedFilterQuery($scope.filterQuery);
    }

    if (status === 'category')
    {
      AdvancedFilters.category($scope.categories, $scope.activeAdvancedFilters);
    }

    if (status === 'status')
    {
      AdvancedFilters.status($scope.statuses, $scope.activeAdvancedFilters);
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
