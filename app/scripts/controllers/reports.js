'use strict';

angular.module('zupPainelApp')

.controller('ReportsCtrl', function ($scope, Restangular, $modal, $q) {
 $scope.loading = true;

  var page = 1, per_page = 30, total, searchText = '';

  $scope.loadingPagination = false;

  var selectedCategories = $scope.selectedCategories = {};
  var selectedStatus = $scope.selectedStatus = null;
  var beginDate = null, endDate = null;

  // Return right promise
  var generateReportsPromise = function(searchText) {
    var url = Restangular.one('search').all('reports').all('items'), options = { page: page, per_page: per_page };

    // if we searching, hit search/users
    if (searchText != '')
    {
      options.address = searchText;
    }

    // check if we have categories selected
    if (Object.keys(selectedCategories).length != 0)
    {
      var categories = [];

      for (var key in selectedCategories)
      {
        if (selectedCategories[key] == true)
        {
          categories.push(key);
        }
      }

      if (categories.length !== 0)
      {
        options.reports_categories_ids = categories.join();
      }
    }

    // check if we have a status selected
    if (selectedStatus !== null)
    {
      options.statuses_ids = selectedStatus;
    }

    if (beginDate !== null)
    {
      options.begin_date = beginDate;
    }

    if (endDate !== null)
    {
      options.end_date = endDate;
    }

    return url.getList(options);
  };

  // Get groups for filters
  var categories = Restangular.one('reports').all('categories').getList({'display_type' : 'full'});

  // One every change of page or search, we create generate a new request based on current values
  var getData = $scope.getData = function(paginate) {
    if ($scope.loadingPagination === false)
    {
      $scope.loadingPagination = true;

      var reportsPromise = generateReportsPromise(searchText);

      $q.all([reportsPromise, categories]).then(function(responses) {
        $scope.categories = responses[1].data;

        if (paginate !== true)
        {
          $scope.reports = responses[0].data;
        }
        else
        {
          if (typeof $scope.reports == 'undefined')
          {
            $scope.reports = [];
          }

          for (var i = 0; i < responses[0].data.length; i++) {
            $scope.reports.push(responses[0].data[i]);
          };

          // add up one page
          page++;
        }

        total = parseInt(responses[0].headers().total);

        var last_page = Math.ceil(total / per_page);

        if (page === (last_page + 1))
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

    for (var i = response.data.length - 1; i >= 0; i--) {
      $scope.selectedCategories[response.data[i].id] = true;
    };

    // merge all categories statuses in one array with no duplicates
    for (var i = response.data.length - 1; i >= 0; i--) {
      for (var j = response.data[i].statuses.length - 1; j >= 0; j--) {
        var found = false;

        for (var k = $scope.statuses.length - 1; k >= 0; k--) {
          if ($scope.statuses[k].id === response.data[i].statuses[j].id)
          {
            found = true;
          }
        };

        if (!found)
        {
          $scope.statuses.push(response.data[i].statuses[j])
        }
      };
    };
  });

  var loadFilters = function() {
    // reset pagination
    page = 1;
    $scope.loadingPagination = false;

    $scope.loadingContent = true;
    $scope.reports = [];

    getData().then(function(response) {
      $scope.loadingContent = false;

      page++;
    });
  };

  // helper to get beginDate and endDate by the slider position
  // Current possible positions: [1, 2, 3, 4]
  var getPeriodByOption = function(pos) {
    // From 6 months ago to today
    if (pos == 1)
    {
      var beginDate = new Date();
      beginDate.setHours(0, 0, 0, 0);
      beginDate = new Date(beginDate.getFullYear(), beginDate.getMonth() - 6, 1);
      beginDate = beginDate.toISOString();
    }

    // From 3 months ago to today
    if (pos == 2)
    {
      var beginDate = new Date();
      beginDate.setHours(0, 0, 0, 0);
      beginDate = new Date(beginDate.getFullYear(), beginDate.getMonth() - 3, 1);
      beginDate = beginDate.toISOString();
    }

    // From 1 month ago to today
    if (pos == 3)
    {
      var beginDate = new Date();
      beginDate.setHours(0, 0, 0, 0);
      beginDate = new Date(beginDate.getFullYear(), beginDate.getMonth() - 1, 1);
      beginDate = beginDate.toISOString();
    }

    // From 1 week ago to today
    if (pos == 4)
    {
      var beginDate = new Date();
      beginDate.setDate(beginDate.getDate() - 7);
      beginDate = beginDate.toISOString();
    }

    var endDate = new Date();
    endDate.setTime(endDate.getTime() + (24 * 60 * 60 * 1000));
    endDate = endDate.toISOString();

    return {beginDate: beginDate, endDate: endDate};
  };

  $scope.changeSelectedCategories = function(id) {
    if ($scope.selectedCategories[id] === true)
    {
      $scope.selectedCategories[id] = false;
    }
    else
    {
      $scope.selectedCategories[id] = true;
    }

    loadFilters();
  };

  $scope.changeSelectedStatuses = function(id) {
    selectedStatus = $scope.selectedStatus = id;

    loadFilters();
  };

  $scope.changeSelectedPeriod = function(pos) {
    var period = {beginDate: null, endDate: null};
    $scope.periodPos = null;

    if (pos != null)
    {
      period = getPeriodByOption(pos);
      $scope.periodPos = pos;
    }

    beginDate = period.beginDate;
    endDate = period.endDate;

    loadFilters();
  };

  // Search function
  $scope.search = function(text) {
    searchText = text;

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
          $scope.report.status_id = statusId;
        };

        $scope.save = function() {
          var changeStatusPromise = Restangular.one('reports', $scope.category.id).one('items', $scope.report.id).customPUT({ 'status_id': $scope.report.status_id });

          changeStatusPromise.then(function(response) {
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

.controller('ReportsMapCtrl', function ($scope, $q, Restangular) {
  $scope.loading = true;

  var selectedCategories = $scope.selectedCategories = {};

  var inventoryCategoriesPromise = Restangular.one('inventory').all('categories').getList({display_type: 'full'});
  var reportsCategoriesPromise = Restangular.one('reports').all('categories').getList({display_type: 'full'});

  $q.all([inventoryCategoriesPromise, reportsCategoriesPromise]).then(function(responses) {
    $scope.inventoryCategories = responses[0].data;
    $scope.reportCategories = responses[1].data;

    for (var i = $scope.reportCategories.length - 1; i >= 0; i--) {
      $scope.selectedCategories[$scope.reportCategories[i].id] = true;
    };

    $scope.loading = false;
  });

  // create statuses array
  reportsCategoriesPromise.then(function(response) {
    $scope.statuses = [];

    for (var i = response.data.length - 1; i >= 0; i--) {
      $scope.selectedCategories[response.data[i].id] = true;
    };

    // merge all categories statuses in one array with no duplicates
    for (var i = response.data.length - 1; i >= 0; i--) {
      for (var j = response.data[i].statuses.length - 1; j >= 0; j--) {
        var found = false;

        for (var k = $scope.statuses.length - 1; k >= 0; k--) {
          if ($scope.statuses[k].id === response.data[i].statuses[j].id)
          {
            found = true;
          }
        };

        if (!found)
        {
          $scope.statuses.push(response.data[i].statuses[j])
        }
      };
    };
  });

  $scope.getInventoryCategory = function(id) {
    for (var i = $scope.inventoryCategories.length - 1; i >= 0; i--) {
      if ($scope.inventoryCategories[i].id === id)
      {
        return $scope.inventoryCategories[i];
      }
    }

    return null;
  };

  $scope.getReportCategory = function(id) {
    for (var i = $scope.reportCategories.length - 1; i >= 0; i--) {
      if ($scope.reportCategories[i].id === id)
      {
        return $scope.reportCategories[i];
      }
    }

    return null;
  };

  $scope.getItemsPeriodBySliderPosition = function(pos) {
    // From 6 months ago to today
    if (pos == 1)
    {
      var beginDate = new Date();
      beginDate.setHours(0, 0, 0, 0);
      beginDate = new Date(beginDate.getFullYear(), beginDate.getMonth() - 6, 1);
      beginDate = beginDate.toISOString();
    }

    // From 3 months ago to today
    if (pos == 2)
    {
      var beginDate = new Date();
      beginDate.setHours(0, 0, 0, 0);
      beginDate = new Date(beginDate.getFullYear(), beginDate.getMonth() - 3, 1);
      beginDate = beginDate.toISOString();
    }

    // From 1 month ago to today
    if (pos == 3)
    {
      var beginDate = new Date();
      beginDate.setHours(0, 0, 0, 0);
      beginDate = new Date(beginDate.getFullYear(), beginDate.getMonth() - 1, 1);
      beginDate = beginDate.toISOString();
    }

    // From 1 week ago to today
    if (pos == 4)
    {
      var beginDate = new Date();
      beginDate.setDate(beginDate.getDate() - 7);
      beginDate = beginDate.toISOString();
    }

    var endDate = new Date();
    endDate.setTime(endDate.getTime() + (24 * 60 * 60 * 1000));
    endDate = endDate.toISOString();

    return {beginDate: beginDate, endDate: endDate};
  };

  $scope.changeSelectedCategories = function(id) {
    if ($scope.selectedCategories[id] === true)
    {
      $scope.selectedCategories[id] = false;
    }
    else
    {
      $scope.selectedCategories[id] = true;
    }

    $scope.filterByReportCategory(id);
  };

  $scope.changeSelectedStatuses = function(id) {
    $scope.selectedStatus = id;

    $scope.filterReportsByStatus(id);
  };

  $scope.changeSelectedPeriod = function(pos) {
    $scope.periodPos = pos;

    $scope.filterReportsByPeriod($scope.getItemsPeriodBySliderPosition(pos));
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
  var categoriesPromise = Restangular.one('reports').all('categories').getList();

  $q.all([reportPromise, categoriesPromise]).then(function(responses) {
    $scope.report = responses[0].data;

    $scope.report.status_id = $scope.report.status.id;

    // find category
    for (var i = responses[1].data.length - 1; i >= 0; i--) {
      if (responses[1].data[i].id == $routeParams.categoryId)
      {
        $scope.category = responses[1].data[i];
      }
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
          $scope.report.status_id = statusId;
        };

        $scope.save = function() {
          var changeStatusPromise = Restangular.one('reports', $scope.category.id).one('items', $scope.report.id).customPUT({ 'status_id': $scope.report.status_id });

          changeStatusPromise.then(function(response) {
            report.status_id = $scope.report.status_id;

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

  $scope.default_resolution_time_selection = 60;
  $scope.default_user_response_time_selection = 60;

  var categoriesPromise = Restangular.one('inventory').all('categories').getList();

  if (updating)
  {
    // We create a empty category object to be passed on PUT
    var category = $scope.category = {};

    var categoryPromise = Restangular.one('reports').one('categories', categoryId).get();

    $q.all([categoriesPromise, categoryPromise]).then(function(responses) {
      $scope.categories = responses[0].data;

      // ...and we populate $scope.category with the data from the server =)
      category.title = responses[1].data.title;
      category.color = responses[1].data.color;
      category.allows_arbitrary_position = responses[1].data.allows_arbitrary_position;
      category.statuses = responses[1].data.statuses;

      if (responses[1].data.user_response_time !== null)
      {
        $scope.enabled_user_response_time = true;
        category.user_response_time = Math.round(responses[1].data.user_response_time / 60);
      }

      if (responses[1].data.resolution_time !== null)
      {
        // ...and convert resolution_time to minutes
        category.resolution_time = Math.round(responses[1].data.resolution_time  / 60);
      }

      if (typeof responses[1].data.inventory_categories == 'object' && responses[1].data.inventory_categories.length !== 0)
      {
        category.inventory_categories = [];

        for (var i = responses[1].data.inventory_categories.length - 1; i >= 0; i--) {
          category.inventory_categories.push(responses[1].data.inventory_categories[i].id);
        };
      }

      $scope.icon = responses[1].data.original_icon;

      $scope.loading = false;
    });
  }
  else
  {
    categoriesPromise.then(function(response) {
      $scope.categories = response.data;

      $scope.loading = false;
    });

    $scope.enabled_user_response_time = false;

    // We create a default
    var category = $scope.category = {
      marker: 'R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
      inventory_categories: [],
      allows_arbitrary_position: true,
      statuses: [
        {title: 'Em aberto', color: '#ff0000', initial: true, final: false, active: true},
        {title: 'Em andamento', color: '#ff0000', initial: false, final: false, active: true},
        {title: 'Resolvido', color: '#ff0000', initial: false, final: true, active: true}
      ]
    };
  }

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
            if (status != $scope.category.statuses[i])
            {
              $scope.category.statuses[i].initial = false;
            }
          };

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
        function(item) {
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

      var file = file, picReader = new FileReader();

      picReader.addEventListener('load', function(event) {
        var picFile = event.target;

        icon = picFile.result.replace(/^data:image\/[^;]+;base64,/, '');
        deferred.resolve();
      });

      // pass as base64 and strip data:image
      picReader.readAsDataURL(file);

      return deferred.promise;
    };

    for (var i = uploader.queue.length - 1; i >= 0; i--) {
      promises.push(addAsync(uploader.queue[i].file));
    };

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
      };

      // And we convert the user selection to seconds
      editedCategory.resolution_time = Math.round(editedCategory.resolution_time * $scope.default_resolution_time_selection);

      // also the user feedback time we convert it to seconds
      if (typeof editedCategory.user_response_time !== 'undefined' && editedCategory.user_response_time !== 'null' && $scope.enabled_user_response_time == true)
      {
        editedCategory.user_response_time = Math.round(editedCategory.user_response_time * $scope.default_user_response_time_selection);
      }
      else
      {
        editedCategory.user_response_time = null;
      }

      // PUT if updating and POST if creating a new category
      if (updating)
      {
        if (icon)
        {
          editedCategory.icon = icon;
        }

        var postCategoryPromise = Restangular.one('reports').one('categories', categoryId).customPUT(editedCategory);

        postCategoryPromise.then(function(response) {
          $scope.showMessage('ok-circle', 'A categoria de relato foi atualizada com sucesso', true);

          $scope.processingForm = false;
        }, function(response) {
          $scope.inputErrors = response.data.error;
          $scope.processingForm = false;
        });
      }
      else
      {
        editedCategory.icon = icon;
        editedCategory.marker = icon;

        var postCategoryPromise = Restangular.one('reports').post('categories', editedCategory);

        postCategoryPromise.then(function(response) {
          $location.path('/reports/categories');

          $scope.processingForm = false;
        }, function(response) {
          $scope.inputErrors = response.data.error;
          $scope.processingForm = false;
        });
      }
    });
  };
});
