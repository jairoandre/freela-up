'use strict';

angular
  .module('ItemsIndexControllerModule', [
    'ItemsDestroyModalControllerModule'
  ])

  .controller('ItemsIndexController', function ($scope, $modal, $q, Restangular, isMap, AdvancedFilters, $location, $window, categoriesResponse, $cookies, FullResponseRestangular) {
    $scope.loading = true;

    var page = 1, perPage = 300, total, searchText = '';

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
      $scope.fields = [];

      // map options
      $scope.position = null;
      $scope.selectedAreas = [];
      $scope.zoom = null;
      $scope.clusterize = null;
    };

    // sorting the tables
    $scope.sort = {
      column: '',
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
    };

    $scope.selectedCls = function (column) {
      return column === $scope.sort.column && 'sort-' + $scope.sort.descending;
    };

    $scope.availableFilters = [
      {name: 'Protocolo ou endereço contém...', action: 'query'},
      {name: 'Com as categorias...', action: 'category'},
      {name: 'Com os estados...', action: 'status'},
      {name: 'Por criador do item...', action: 'author'},
      {name: 'Por período...', action: 'date'},
      {name: 'Por perímetro...', action: 'area'},
      {name: 'Por campos...', action: 'fields'}
    ];

    $scope.activeAdvancedFilters = [];

    $scope.$watch('activeAdvancedFilters', function() {
      resetFilters();

      // save filters into hash
      if ($scope.activeAdvancedFilters.length !== 0)
      {
        $scope.filtersHash = $window.btoa(JSON.stringify($scope.activeAdvancedFilters));
        $location.search('filters', $scope.filtersHash);
        $cookies.inventoryFiltersHash = $scope.filtersHash;
      }
      else
      {
        $location.search('filters', null);
        $scope.filtersHash = null;
        delete $cookies.inventoryFiltersHash;
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

        if (filter.type === 'fields')
        {
          $scope.fields.push(filter.value);
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

    if (typeof $cookies.inventoryFiltersHash !== 'undefined')
    {
      $scope.activeAdvancedFilters = JSON.parse($window.atob($cookies.inventoryFiltersHash));
    }

    if (typeof $location.search().filters !== 'undefined')
    {
      $scope.filtersHash = $location.search().filters;
      $scope.activeAdvancedFilters = JSON.parse($window.atob($scope.filtersHash));
    }

    // Return right promise
    var generateItemsPromise = function() {
      var url = FullResponseRestangular.one('search').all('inventory').all('items'), options = { page: page, per_page: perPage, display_type: 'full', sort: 'title', order: 'desc' }; // jshint ignore:line

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
        options['created_at[begin]'] = $scope.beginDate;
      }

      if ($scope.endDate !== null)
      {
        options['created_at[end]'] = $scope.endDate;
      }

      // fields
      if ($scope.fields.length !== 0)
      {
        for (var i = $scope.fields.length - 1; i >= 0; i--) {
          var key = 'fields[' + $scope.fields[i].id + '][' + $scope.fields[i].condition + ']';

          options[key] = $scope.fields[i].value;
        }
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
        for (var z = $scope.selectedAreas.length - 1; z >= 0; z--) {
          var latKey = 'position[' + z + '][latitude]';
          var lngKey = 'position[' + z + '][longitude]';
          var disKey = 'position[' + z + '][distance]';

          options[latKey] = $scope.selectedAreas[z].latitude;
          options[lngKey] = $scope.selectedAreas[z].longitude;
          options[disKey] = $scope.selectedAreas[z].distance;
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

        var itemsPromise = generateItemsPromise(searchText);

        itemsPromise.then(function(response) {
          if (paginate !== true)
          {
            $scope.items = response.data.items;
          }
          else
          {
            if (typeof $scope.items === 'undefined')
            {
              $scope.items = [];
            }

            for (var i = 0; i < response.data.items.length; i++) {
              $scope.items.push(response.data.items[i]);
            }

            // add up one page
            page++;
          }

          total = parseInt(response.headers().total);
          $scope.total = total;

          var lastPage = Math.ceil(total / perPage);

          if (page === (lastPage + 1) && paginate === true)
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
        $scope.items = [];

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

    $scope.share = function () {
      AdvancedFilters.share();
    };

    $scope.changeToMap = function() {
      if ($scope.filtersHash !== null)
      {
        $location.url('/inventories/map?filters=' + $scope.filtersHash);
      }
      else
      {
        $location.url('/inventories/map');
      }
    };

    $scope.changeToList = function() {
      if ($scope.filtersHash !== null)
      {
        $location.url('/inventories?filters=' + $scope.filtersHash);
      }
      else
      {
        $location.url('/inventories');
      }
    };

    $scope.deleteItem = function (item, category) {
      $modal.open({
        templateUrl: 'modals/items/destroy/items-destroy.template.html',
        windowClass: 'removeModal',
        resolve: {
          removeItemFromList: function() {
            return function(item) {
              $scope.total--;
              $scope.items.splice($scope.items.indexOf(item), 1);
            }
          },

          item: function() {
            return item;
          },

          category: function() {
            return category;
          }
        },
        controller: 'ItemsDestroyModalController'
      });
    };

    $scope.export = function() {
        $modal.open({
          templateUrl: 'views/inventories/export.html',
          windowClass: 'filterCategoriesModal',
          resolve: {
            categories: function() {
              return $scope.categories;
            }
          },
          controller: ['$scope', '$modalInstance', 'categories', function($scope, $modalInstance, categories) {
            $scope.categories = categories;

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

            $scope.close = function() {
              $modalInstance.close();
            };
          }]
        });
      };
  });
