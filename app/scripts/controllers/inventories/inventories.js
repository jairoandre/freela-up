'use strict';

angular.module('zupPainelApp')

.controller('InventoriesCtrl', function ($scope, $modal, Inventories, $q, Restangular, isMap, AdvancedFilters) {
  $scope.loading = true;

  var page = 1, perPage = 30, total, searchText = '';

  $scope.loadingPagination = false;

  // Basic filters
  var resetFilters = function() {
    $scope.selectedCategories = [];
    $scope.selectedStatuses = [];
    $scope.selectedUsers = [];
    $scope.beginDate = null;
    $scope.endDate = null;
    $scope.searchText = null;
    $scope.fields = null;

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

  $scope.availableFilters = [
    {name: 'Com as categorias...', action: 'category'},
    {name: 'Com os estados...', action: 'status'},
    {name: 'Criado pelos munícipes...', action: 'author'},
    {name: 'Por período...', action: 'date'},
    {name: 'Por perímetro...', action: 'area'},
    {name: 'Por campos...', action: 'fields'}
  ];

  $scope.activeAdvancedFilters = [];

  // Return right promise
  var generateItemsPromise = function() {
    var url = Restangular.one('search').all('inventory').all('items'), options = { page: page, per_page: perPage }; // jshint ignore:line

    // if we searching, hit search/users
    if ($scope.searchText !== null)
    {
      options.query = $scope.searchText;
    }

    // check if we have categories selected
    if ($scope.selectedCategories.length !== 0)
    {
      options.inventory_categories_ids = $scope.selectedCategories.join(); // jshint ignore:line
    }

    // check if we have statuses selected
    if ($scope.selectedStatuses.length !== 0)
    {
      options.inventory_statuses_ids = $scope.selectedStatuses.join(); // jshint ignore:line
    }

    // check if we have statuses selected
    if ($scope.selectedUsers.length !== 0)
    {
      options.users_ids = $scope.selectedUsers.join(); // jshint ignore:line
    }

    if ($scope.beginDate !== null)
    {
      var beginDate = new Date($scope.beginDate);

      options['created_at[begin]'] = beginDate.toISOString();
    }

    if ($scope.endDate !== null)
    {
      var endDate = new Date($scope.endDate);

      options['created_at[end]'] = endDate.toISOString();
    }

    // fields
    if ($scope.fields !== null)
    {
      for (var i = $scope.fields.length - 1; i >= 0; i--) {
        var key = 'fields[' + $scope.fields[i].id + '][' + $scope.fields[i].condition + ']';

        options[key] = $scope.fields[i].value;
      }
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
  var categories = Restangular.one('inventory').all('categories').getList();

  // One every change of page or search, we create generate a new request based on current values
  var getData = $scope.getData = function(paginate) {
    if ($scope.loadingPagination === false)
    {
      $scope.loadingPagination = true;

      var itemsPromise = generateItemsPromise(searchText);

      $q.all([itemsPromise, categories]).then(function(responses) {
        $scope.categories = responses[1].data;

        if (paginate !== true)
        {
          $scope.items = responses[0].data;
        }
        else
        {
          if (typeof $scope.items === 'undefined')
          {
            $scope.items = [];
          }

          for (var i = 0; i < responses[0].data.length; i++) {
            $scope.items.push(responses[0].data[i]);
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

      return itemsPromise;
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
      $scope.items = [];

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
          $scope.selectedCategories.push(filter.value);
        }

        if (filter.type === 'statuses')
        {
          $scope.selectedStatuses.push(filter.value);
        }

        if (filter.type === 'authors')
        {
          $scope.selectedUsers = filter.value;
        }

        if (filter.type === 'fields')
        {
          $scope.fields = filter.value;
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

    if (status === 'fields')
    {
      AdvancedFilters.fields($scope.categories, $scope.activeAdvancedFilters);
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
    searchText = text;

    loadFilters();
  };

  $scope.getInventoryCategory = function(id) {
    for (var i = $scope.categories.length - 1; i >= 0; i--) {
      if ($scope.categories[i].id === id)
      {
        return $scope.categories[i];
      }
    }

    return null;
  };

  $scope.deleteItem = function (item, category) {
    $modal.open({
      templateUrl: 'views/inventories/items/removeItem.html',
      windowClass: 'removeModal',
      resolve: {
        itemsList: function() {
          return $scope.items;
        },

        item: function() {
          return item;
        },

        category: function() {
          return category;
        }
      },
      controller: ['$scope', '$modalInstance', 'itemsList', 'item', 'category', function($scope, $modalInstance, itemsList, item, category) {
        $scope.item = item;
        $scope.category = category;

        // delete user from server
        $scope.confirm = function() {
          var deletePromise = Restangular.one('inventory').one('categories', $scope.category.id).one('items', $scope.item.id).remove();

          deletePromise.then(function() {
            $modalInstance.close();
            $scope.showMessage('ok', 'O Inventário ' + $scope.item.title + ' foi removido com sucesso', 'success', true);

            // remove user from list
            itemsList.splice(itemsList.indexOf($scope.item), 1);
          });
        };

        $scope.close = function() {
          $modalInstance.close();
        };
      }]
    });
  };
});
