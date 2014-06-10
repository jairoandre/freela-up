'use strict';

angular.module('zupPainelApp')

.controller('ReportsCtrl', function ($scope, Restangular, $modal, $q, isMap) {
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
    if ($scope.position !== null)
    {
      options['position[latitude]'] = $scope.position.latitude;
      options['position[longitude]'] = $scope.position.longitude;
      options['position[distance]'] = $scope.position.distance;
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

  $scope.$watch('activeAdvancedFilters', function() {
    if ($scope.advancedSearch === true)
    {
      resetFilters();

      for (var i = $scope.activeAdvancedFilters.length - 1; i >= 0; i--) {
        var filter = $scope.activeAdvancedFilters[i];

        if (filter.type === 'query')
        {
          $scope.searchText = filter.value;
        }

        if (filter.type === 'categories')
        {
          $scope.selectedCategories = filter.value;
        }

        if (filter.type === 'statuses')
        {
          $scope.selectedStatuses = filter.value;
        }

        if (filter.type === 'authors')
        {
          $scope.selectedUsers = filter.value;
        }

        if (filter.type === 'beginDate')
        {
          $scope.beginDate = filter.value;
        }

        if (filter.type === 'endDate')
        {
          $scope.endDate = filter.value;
        }
      }

      loadFilters();
    }
  }, true);

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

  var advancedFilterCategory = function() {
    $modal.open({
      templateUrl: 'views/reports/filters/category.html',
      windowClass: 'filterCategoriesModal',
      resolve: {
        categories: function() {
          return $scope.categories;
        },

        activeAdvancedFilters: function() {
          return $scope.activeAdvancedFilters;
        }
      },
      controller: ['$scope', '$modalInstance', 'categories', 'activeAdvancedFilters', function($scope, $modalInstance, categories, activeAdvancedFilters) {
        $scope.categories = categories;
        $scope.activeAdvancedFilters = activeAdvancedFilters;

        $scope.updateCategory = function(category) {
          var i = $scope.categories.indexOf(category);

          if ($scope.categories[i].selected === true)
          {
            $scope.categories[i].selected = false;
          }
          else
          {
            $scope.categories[i].selected = true;
          }
        };

        $scope.save = function() {
          var filter = {
            title: 'Categorias',
            type: 'categories',
            value: []
          };

          var desc = [];

          for (var i = $scope.categories.length - 1; i >= 0; i--) {
            if ($scope.categories[i].selected === true)
            {
              filter.value.push($scope.categories[i].id);
              desc.push(' ' + $scope.categories[i].title);
            }
          }

          filter.desc = desc.join();

          $scope.activeAdvancedFilters.push(filter);

          $modalInstance.close();
        };

        $scope.close = function() {
          $modalInstance.close();
        };
      }]
    });
  };

  var advancedFilterStatus = function() {
    $modal.open({
      templateUrl: 'views/reports/filters/status.html',
      windowClass: 'filterStatusesModal',
      resolve: {
        statuses: function() {
          return $scope.statuses;
        },

        activeAdvancedFilters: function() {
          return $scope.activeAdvancedFilters;
        }
      },
      controller: ['$scope', '$modalInstance', 'statuses', 'activeAdvancedFilters', function($scope, $modalInstance, statuses, activeAdvancedFilters) {
        $scope.statuses = statuses;
        $scope.activeAdvancedFilters = activeAdvancedFilters;

        $scope.updateStatus = function(status) {
          var i = $scope.statuses.indexOf(status);

          if ($scope.statuses[i].selected === true)
          {
            $scope.statuses[i].selected = false;
          }
          else
          {
            $scope.statuses[i].selected = true;
          }
        };

        $scope.save = function() {
          var filter = {
            title: 'Estados',
            type: 'statuses',
            value: []
          };

          var desc = [];

          for (var i = $scope.statuses.length - 1; i >= 0; i--) {
            if ($scope.statuses[i].selected === true)
            {
              filter.value.push($scope.statuses[i].id);
              desc.push(' ' + $scope.statuses[i].title);
            }
          }

          filter.desc = desc.join();

          $scope.activeAdvancedFilters.push(filter);

          $modalInstance.close();
        };

        $scope.close = function() {
          $modalInstance.close();
        }; // hello
      }]
    });
  };

  var advancedFilterAuthor = function() {
    $modal.open({
      templateUrl: 'views/reports/filters/author.html',
      windowClass: 'filterAuthorModal',
      resolve: {
        activeAdvancedFilters: function() {
          return $scope.activeAdvancedFilters;
        }
      },
      controller: ['$scope', '$modalInstance', 'activeAdvancedFilters', function($scope, $modalInstance, activeAdvancedFilters) {
        $scope.activeAdvancedFilters = activeAdvancedFilters;
        $scope.users = [];
        $scope.field = {};

        $scope.usersAutocomplete = {
          options: {
            onlySelect: true,
            source: function( request, uiResponse ) {
              var categoriesPromise = Restangular.one('search').all('users').getList({ name: request.term });

              categoriesPromise.then(function(response) {
                uiResponse( $.map( response.data, function( user ) {
                  return {
                    label: user.name,
                    value: user.name,
                    user: {id: user.id, name: user.name}
                  };
                }));
              });
            },
            messages: {
              noResults: '',
              results: function() {}
            }
          }
        };

        $scope.usersAutocomplete.events = {
          select: function( event, ui ) {
            var found = false;

            for (var i = $scope.users.length - 1; i >= 0; i--) {
              if ($scope.users[i].id === ui.item.user.id)
              {
                found = true;
              }
            }

            if (!found)
            {
              $scope.users.push(ui.item.user);
            }
          },

          change: function() {
            $scope.field.text = '';
          }
        };

        $scope.removeUser = function(user) {
          $scope.users.splice($scope.users.indexOf(user), 1);
        };

        $scope.save = function() {
          var filter = {
            title: 'Usuários',
            type: 'authors',
            value: []
          };

          var desc = [];

          for (var i = $scope.users.length - 1; i >= 0; i--) {
            filter.value.push($scope.users[i].id);
            desc.push(' ' + $scope.users[i].name);
          }

          filter.desc = desc.join();

          $scope.activeAdvancedFilters.push(filter);

          $modalInstance.close();
        };

        $scope.close = function() {
          $modalInstance.close();
        };
      }]
    });
  };

  var advancedFilterPeriod = function() {
    $modal.open({
      templateUrl: 'views/inventories/filters/period.html',
      windowClass: 'filterPeriodModal',
      resolve: {
        activeAdvancedFilters: function() {
          return $scope.activeAdvancedFilters;
        }
      },
      controller: ['$scope', '$modalInstance', 'activeAdvancedFilters', function($scope, $modalInstance, activeAdvancedFilters) {
        $scope.activeAdvancedFilters = activeAdvancedFilters;
        $scope.period = {beginDate: new Date(), endDate: new Date(), tab: 'between'};

        $scope.save = function() {
          if ($scope.period.tab === 'between' || $scope.period.tab === 'from')
          {
            var beginDateFilter = {
              title: 'A partir da data',
              type: 'beginDate',
              desc: $scope.period.beginDate.getDate() + '/' + ($scope.period.beginDate.getMonth() + 1) + '/' + $scope.period.beginDate.getFullYear(),
              value: $scope.period.beginDate
            };

            $scope.activeAdvancedFilters.push(beginDateFilter);
          }

          if ($scope.period.tab === 'between' || $scope.period.tab === 'to')
          {
            var endDateFilter = {
              title: 'Até a data',
              type: 'endDate',
              desc: $scope.period.endDate.getDate() + '/' + ($scope.period.endDate.getMonth() + 1) + '/' + $scope.period.endDate.getFullYear(),
              value: $scope.period.endDate
            };

            $scope.activeAdvancedFilters.push(endDateFilter);
          }

          $modalInstance.close();
        };

        $scope.close = function() {
          $modalInstance.close();
        };
      }]
    });
  };

  var advancedFilterArea = function() {
    $modal.open({
      templateUrl: 'views/reports/filters/area.html',
      windowClass: 'filterAreaModal',
      resolve: {
        activeAdvancedFilters: function() {
          return $scope.activeAdvancedFilters;
        }
      },
      controller: ['$scope', '$modalInstance', 'activeAdvancedFilters', function($scope, $modalInstance, activeAdvancedFilters) {
        $scope.activeAdvancedFilters = activeAdvancedFilters;

        $scope.save = function() {
          var beginDateFilter = {
            title: 'A partir da data',
            type: 'beginDate',
            desc: $scope.period.beginDate.getDate() + '/' + ($scope.period.beginDate.getMonth() + 1) + '/' + $scope.period.beginDate.getFullYear(),
            value: $scope.period.beginDate
          };

          $scope.activeAdvancedFilters.push(beginDateFilter);

          $modalInstance.close();
        };

        $scope.close = function() {
          $modalInstance.close();
        };
      }]
    });
  };

  $scope.loadFilter = function(status) {
    if (status === 'query')
    {
      advancedFilterQuery($scope.filterQuery);
    }

    if (status === 'category')
    {
      advancedFilterCategory();
    }

    if (status === 'status')
    {
      advancedFilterStatus();
    }

    if (status === 'author')
    {
      advancedFilterAuthor();
    }

    if (status === 'date')
    {
      advancedFilterPeriod();
    }

    if (status === 'area')
    {
      advancedFilterArea();
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
})

.controller('ReportsCategoriesCtrl', function ($scope, Restangular, $modal) {
  $scope.loading = true;

  var categoriesPromise = Restangular.one('reports').all('categories').getList();

  categoriesPromise.then(function(response) {
    $scope.categories = response.data;

    $scope.loading = false;
  });

  $scope.deleteCategory = function (category) {
    $modal.open({
      templateUrl: 'views/reports/removeCategory.html',
      windowClass: 'removeModal',
      resolve: {
        reportsCategoriesList: function(){
          return $scope.categories;
        }
      },
      controller: ['$scope', '$modalInstance', 'reportsCategoriesList', function($scope, $modalInstance, reportsCategoriesList) {
        $scope.category = category;

        // delete user from server
        $scope.confirm = function() {
          var deletePromise = Restangular.one('reports').one('categories', $scope.category.id).remove();

          deletePromise.then(function() {
            $modalInstance.close();
            $scope.showMessage('ok', 'A categoria de relato foi removida com sucesso', 'success', true);

            // remove user from list
            reportsCategoriesList.splice(reportsCategoriesList.indexOf($scope.category), 1);
          });
        };

        $scope.close = function() {
          $modalInstance.close();
        };
      }]
    });
  };
})

.controller('ReportsCategoriesItemCtrl', function ($scope, Restangular, $routeParams, $q, $modal) {
  $scope.loading = true;

  var reportPromise = Restangular.one('reports').one('items', $routeParams.id).get();
  var feedbackPromise = Restangular.one('reports', $routeParams.id).one('feedback').get();
  var categoriesPromise = Restangular.one('reports').all('categories').getList();

  $q.all([reportPromise, categoriesPromise, feedbackPromise]).then(function(responses) {
    $scope.report = responses[0].data;

    $scope.report.status_id = $scope.report.status.id; // jshint ignore:line

    $scope.feedback = responses[2].data;

    // find category
    for (var i = responses[1].data.length - 1; i >= 0; i--) {
      if (responses[1].data[i].id.toString() === $routeParams.categoryId)
      {
        $scope.category = responses[1].data[i];
      }
    }

    $scope.images = [];

    for (var c = $scope.report.images.length - 1; c >= 0; c--) {
      $scope.images.push({src: $scope.report.images[c].high});
    }

    $scope.loading = false;
  });

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
        $scope.report = angular.copy(report);

        $scope.changeStatus = function(statusId) {
          $scope.report.status_id = statusId; // jshint ignore:line
        };

        $scope.save = function() {
          var changeStatusPromise = Restangular.one('reports', $scope.category.id).one('items', $scope.report.id).customPUT({ 'status_id': $scope.report.status_id }); // jshint ignore:line

          changeStatusPromise.then(function() {
            report.status_id = $scope.report.status_id; // jshint ignore:line

            $modalInstance.close();
          });
        };

        $scope.close = function() {
          $modalInstance.close();
        };
      }]
    });
  };
})

.controller('ReportsCategoriesEditCtrl', function ($scope, $routeParams, Restangular, $fileUploader, $q, $location, $modal) {
  var updating = $scope.updating = false;
  var categoryId = $routeParams.id;

  if (typeof categoryId !== 'undefined')
  {
    updating = true;
    $scope.updating = true;
  }

  // Start loading & get necessary requests
  $scope.loading = true;

  $scope.defaultResolutionTimeSelection = 60;
  $scope.defaultUserResponseTimeSelection = 60;

  var categoriesPromise = Restangular.one('inventory').all('categories').getList(), category;

  if (updating)
  {
    // We create a empty category object to be passed on PUT
    category = $scope.category = {};

    var categoryPromise = Restangular.one('reports').one('categories', categoryId).get();

    $q.all([categoriesPromise, categoryPromise]).then(function(responses) {
      $scope.categories = responses[0].data;

      // ...and we populate $scope.category with the data from the server =)
      category.title = responses[1].data.title;
      category.color = responses[1].data.color;
      category.allows_arbitrary_position = responses[1].data.allows_arbitrary_position; // jshint ignore:line
      category.statuses = responses[1].data.statuses;

      if (responses[1].data.user_response_time !== null) // jshint ignore:line
      {
        $scope.enabledUserResponseTime = true;
        category.user_response_time = Math.round(responses[1].data.user_response_time / 60); // jshint ignore:line
      }

      if (responses[1].data.resolution_time !== null) // jshint ignore:line
      {
        // ...and convert resolution_time to minutes
        category.resolution_time = Math.round(responses[1].data.resolution_time  / 60); // jshint ignore:line
      }

      category.inventory_categories = []; // jshint ignore:line

      /* jshint ignore:start */
      if (typeof responses[1].data.inventory_categories == 'object' && responses[1].data.inventory_categories.length !== 0)
      {
        for (var i = responses[1].data.inventory_categories.length - 1; i >= 0; i--) {
          category.inventory_categories.push(responses[1].data.inventory_categories[i].id);
        };
      }
      /* jshint ignore:end */

      $scope.icon = responses[1].data.original_icon; // jshint ignore:line

      $scope.loading = false;
    });
  }
  else
  {
    categoriesPromise.then(function(response) {
      $scope.categories = response.data;

      $scope.loading = false;
    });

    $scope.enabledUserResponseTime = false;

    // We create a default
    category = $scope.category = {
      marker: 'R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
      inventory_categories: [], // jshint ignore:line
      allows_arbitrary_position: true, // jshint ignore:line
      color: '#2AB4DC',
      statuses: [
        {title: 'Em aberto', color: '#E68012', initial: true, final: false, active: true},
        {title: 'Em andamento', color: '#919191', initial: false, final: false, active: true},
        {title: 'Resolvido', color: '#5EB623', initial: false, final: true, active: true}
      ]
    };
  }

  $scope.categoriesAutocomplete = {
    options: {
      source: function( request, uiResponse ) {
        var categoriesPromise = Restangular.one('search').one('inventory').all('categories').getList({ title: request.term });

        categoriesPromise.then(function(response) {
          uiResponse( $.map( response.data, function( item ) {
            return {
              label: item.title,
              value: item.title,
              id: item.id
            };
          }));
        });
      },
      select: function( event, ui ) {
        $scope.addCategory(ui.item.id);
      },
      messages: {
        noResults: '',
        results: function() {}
      }
    }
  };

  $scope.addCategory = function(id) {
    if (!~category.inventory_categories.indexOf(id)) // jshint ignore:line
    {
      category.inventory_categories.push(id); // jshint ignore:line
    }
  };

  $scope.removeCategory = function(id) {
    category.inventory_categories.splice(category.inventory_categories.indexOf(id), 1); // jshint ignore:line
  };

  $scope.manageStatuses = function () {
    $modal.open({
      templateUrl: 'views/reports/manageStatuses.html',
      windowClass: 'manageStatuses',
      resolve: {
        category: function() {
          return $scope.category;
        }
      },
      controller: ['$scope', '$modalInstance', 'category', function($scope, $modalInstance, category) {
        $scope.category = category;
        $scope.newStatus = {};

        $scope.createStatus = function() {
          if ($scope.newStatus.title !== '')
          {
            $scope.category.statuses.push({title: $scope.newStatus.title, color: '#FFFFFF', initial: 'false', final: 'false'});

            $scope.newStatus.title = '';
          }
        };

        $scope.changeInitial = function(status) {
          for (var i = $scope.category.statuses.length - 1; i >= 0; i--) {
            if (status !== $scope.category.statuses[i])
            {
              $scope.category.statuses[i].initial = false;
            }
          }

          // force change if user clicks on same checkbox
          status.initial = true;
        };

        $scope.removeStatus = function(status) {
          $scope.category.statuses.splice($scope.category.statuses.indexOf(status), 1);
        };

        $scope.close = function() {
          $modalInstance.close();
        };
      }]
    });
  };

  // Image uploader
  var uploader = $scope.uploader = $fileUploader.create({
    scope: $scope,
    filters: [
      function() {
        uploader.queue = [];
        return true;
      }
    ]
  });

  // Images only
  uploader.filters.push(function(item /*{File|HTMLInputElement}*/) {
    var type = uploader.isHTML5 ? item.type : '/' + item.value.slice(item.value.lastIndexOf('.') + 1);
    type = '|' + type.toLowerCase().slice(type.lastIndexOf('/') + 1) + '|';
    return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
  });

  $scope.send = function() {
    $scope.inputErrors = null;
    $scope.processingForm = true;
    var icon, promises = [];

    // Add images to queue for processing it's dataUrl
    function addAsync(file) {
      var deferred = $q.defer();

      var picReader = new FileReader();

      picReader.addEventListener('load', function(event) {
        var picFile = event.target;

        icon = picFile.result.replace(/^data:image\/[^;]+;base64,/, '');
        deferred.resolve();
      });

      // pass as base64 and strip data:image
      picReader.readAsDataURL(file);

      return deferred.promise;
    }

    for (var i = uploader.queue.length - 1; i >= 0; i--) {
      promises.push(addAsync(uploader.queue[i].file));
    }

    // wait for images to process as base64
    $q.all(promises).then(function() {
      var editedCategory = angular.copy(category);

      // change category.statuses to acceptable format for the API
      var tempStatuses = editedCategory.statuses;

      editedCategory.statuses = {};

      for (var i = tempStatuses.length - 1; i >= 0; i--) {
        tempStatuses[i].initial = tempStatuses[i].initial.toString();
        tempStatuses[i].final = tempStatuses[i].initial.toString();
        tempStatuses[i].active = tempStatuses[i].active.toString();

        editedCategory.statuses[i] = tempStatuses[i];
      }

      // And we convert the user selection to seconds
      editedCategory.resolution_time = Math.round(editedCategory.resolution_time * $scope.defaultResolutionTimeSelection); // jshint ignore:line

      // also the user feedback time we convert it to seconds
      if (typeof editedCategory.user_response_time !== 'undefined' && editedCategory.user_response_time !== 'null' && $scope.enabledUserResponseTime == true) // jshint ignore:line
      {
        editedCategory.user_response_time = Math.round(editedCategory.user_response_time * $scope.defaultUserResponseTimeSelection); // jshint ignore:line
      }
      else
      {
        editedCategory.user_response_time = null; // jshint ignore:line
      }

      // PUT if updating and POST if creating a new category
      if (updating)
      {
        if (icon)
        {
          editedCategory.icon = icon;
        }

        var putCategoryPromise = Restangular.one('reports').one('categories', categoryId).customPUT(editedCategory);

        putCategoryPromise.then(function() {
          $scope.showMessage('ok', 'A categoria de relato foi atualizada com sucesso', 'success', true);

          $scope.processingForm = false;
        }, function(response) {
          $scope.showMessage('exclamation-sign', 'A categoria de relato não pode ser salva', 'error', true);

          $scope.inputErrors = response.data.error;
          $scope.processingForm = false;
        });
      }
      else
      {
        editedCategory.icon = icon;
        editedCategory.marker = icon;

        var postCategoryPromise = Restangular.one('reports').post('categories', editedCategory);

        postCategoryPromise.then(function() {
          $location.path('/reports/categories');

          $scope.processingForm = false;
        }, function(response) {
          $scope.showMessage('exclamation-sign', 'A categoria de relato não pode ser salva', 'error', true);

          $scope.inputErrors = response.data.error;
          $scope.processingForm = false;
        });
      }
    });
  };
});
