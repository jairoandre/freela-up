'use strict';

angular.module('zupPainelApp')

.controller('InventoriesCtrl', function ($scope, $modal, Inventories, $q, Restangular, isMap) {
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

  var advancedFilterCategory = function() {
    $modal.open({
      templateUrl: 'views/inventories/filters/category.html',
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
      templateUrl: 'views/inventories/filters/status.html',
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
      templateUrl: 'views/inventories/filters/author.html',
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

  var advancedFilterFields = function() {
    $modal.open({
      templateUrl: 'views/inventories/filters/fields.html',
      windowClass: 'fieldsCategoriesModal',
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

        $scope.items = [];

        $scope.methods = [
          { condition: 'greater_than', text: 'Maior que' },
          { condition: 'lesser_than', text: 'Menor' },
          { condition: 'equal_to', text: 'Igual a' },
          { condition: 'different', text: 'Diferente de' },
          { condition: 'like', text: 'Parecido com' },
          { condition: 'includes', text: 'Inclui' },
          { condition: 'excludes', text: 'Não inclui' },
        ];

        $scope.newField = {
          category: null,
          condition: null,
          field: null,
          value: null
        };

        $scope.selectCategory = function(category) {
          // create array just with fields
          category.fields = [];

          for (var i = category.sections.length - 1; i >= 0; i--) {
            for (var j = category.sections[i].fields.length - 1; j >= 0; j--) {
              category.fields.push(category.sections[i].fields[j]);
            }
          }

          $scope.newField.category = category;
        };

        $scope.selectCondition = function(condition) {
          $scope.newField.condition = condition;
        };

        $scope.selectField = function(field) {
          $scope.newField.field = field;
        };

        $scope.addItem = function() {
          $scope.items.push(angular.copy($scope.newField));
        };

        $scope.fields = [{id: 128, condition: 'equal_to', value: 10}, {id: 133, condition: 'equal_to', value: 11}];

        $scope.save = function() {
          var filter = {
            title: 'Campos',
            type: 'fields',
            value: []
          };

          var desc = [];

          for (var i = $scope.items.length - 1; i >= 0; i--) {
            filter.value.push({id: $scope.items[i].field.id, condition: $scope.items[i].condition.condition, value: $scope.items[i].value});
            desc.push(' ' + $scope.items[i].field.label + ': ' + $scope.items[i].condition.text + ' ' + $scope.items[i].value);
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
      templateUrl: 'views/inventories/filters/area.html',
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

    if (status === 'fields')
    {
      advancedFilterFields();
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