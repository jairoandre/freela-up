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

        options['created_at[begin]'] = beginDate.toISOString();
      }

      if ($scope.endDate !== null)
      {
        var endDate = new Date($scope.endDate);

        options['created_at[end]'] = endDate.toISOString();
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
  })
  .controller('InventoriesCategoriesCtrl', function ($scope, Restangular, $modal) {
    $scope.loading = true;

    var categoriesPromise = Restangular.one('inventory').all('categories').getList();

    categoriesPromise.then(function(response) {
      $scope.categories = response.data;

      $scope.loading = false;
    });

    $scope.deleteCategory = function (category) {
      $modal.open({
        templateUrl: 'views/inventories/removeCategory.html',
        windowClass: 'removeModal',
        resolve: {
          inventoriesCategoriesList: function(){
            return $scope.categories;
          }
        },
        controller: ['$scope', '$modalInstance', 'inventoriesCategoriesList', function($scope, $modalInstance, inventoriesCategoriesList) {
          $scope.category = category;

          // delete user from server
          $scope.confirm = function() {
            var deletePromise = Restangular.one('inventory').one('categories', $scope.category.id).remove();

            deletePromise.then(function() {
              $modalInstance.close();

              // remove user from list
              inventoriesCategoriesList.splice(inventoriesCategoriesList.indexOf($scope.category), 1);
            });
          };

          $scope.close = function() {
            $modalInstance.close();
          };
        }]
      });
    };
  })
  .controller('InventoriesCategoriesEditCtrl', function ($scope, $routeParams, Restangular, $q, $modal, $window) {
    var updating = $scope.updating = false;

    var categoryId = $routeParams.categoryId;

    if (typeof categoryId !== 'undefined')
    {
      updating = true;
      $scope.updating = true;
    }

    $scope.unsavedCategory = false;
    $scope.currentTab = 'fields';

    $scope.availableInputs = [
      {kind: 'text', name: 'Campo de texto', multipleOptions: false},
      {kind: 'integer', name: 'Campo numérico', multipleOptions: false},
      {kind: 'decimal', name: 'Campo decimal', multipleOptions: false},
      {kind: 'checkbox', name: 'Campo de múltipla escolha', multipleOptions: true},
      {kind: 'radio', name: 'Campo de escolha única', multipleOptions: true},
      {kind: 'meters', name: 'Campo em metros', multipleOptions: false},
      {kind: 'centimeters', name: 'Campo em centímetros', multipleOptions: false},
      {kind: 'kilometers', name: 'Campo em quilômetros', multipleOptions: false},
      {kind: 'years', name: 'Campo em anos', multipleOptions: false},
      {kind: 'months', name: 'Campo em meses', multipleOptions: false},
      {kind: 'days', name: 'Campo em dias', multipleOptions: false},
      {kind: 'hours', name: 'Campo em horas', multipleOptions: false},
      {kind: 'seconds', name: 'Campo em segundos', multipleOptions: false},
      {kind: 'angle', name: 'Campo de ângulo', multipleOptions: false},
      {kind: 'date', name: 'Campo de data', multipleOptions: false},
      {kind: 'time', name: 'Campo de tempo', multipleOptions: false},
      {kind: 'cpf', name: 'Campo de CPF', multipleOptions: false},
      {kind: 'cnpj', name: 'Campo de CNPJ', multipleOptions: false},
      {kind: 'url', name: 'Campo de URL', multipleOptions: false},
      {kind: 'email', name: 'Campo de e-mail', multipleOptions: false},
      {kind: 'images', name: 'Campo de imagens', multipleOptions: false},
    ];

    $scope.kindHasMultipleOptions = function(kind) {
      for (var i = $scope.availableInputs.length - 1; i >= 0; i--) {
        if ($scope.availableInputs[i].kind === kind)
        {
          return $scope.availableInputs[i].multipleOptions === true;
        }
      }

      return false;
    };

    $scope.loading = true;

    $scope.category = {};

    if (updating)
    {
      var categoryPromise = Restangular.one('inventory').one('categories', categoryId).get({display_type: 'full'}); // jshint ignore:line
      var groupsPromise = Restangular.all('groups').getList();

      $q.all([groupsPromise, categoryPromise]).then(function(responses) {
        $scope.groups = responses[0].data;
        $scope.category = responses[1].data;

        // watch for modifications in $scope.category
        $scope.$watch('category', function(newValue, oldValue) {
          if (newValue !== oldValue)
          {
            $scope.unsavedCategory = true;
          }
        }, true);

        $scope.loading = false;
      });
    }
    else
    {
      $scope.loading = false;

      // watch for modifications in $scope.category
      $scope.$watch('category', function(newValue, oldValue) {
        if (newValue !== oldValue)
        {
          $scope.unsavedCategory = true;
        }
      }, true);
    }

    // send alert to user before leaving the page that modifications are not saved
    $window.onbeforeunload = function() {
      if ($scope.unsavedCategory === true)
      {
        return 'Você tem certeza que deseja sair? Há alterações que não foram salvas.';
      }
      else
      {
        return null;
      }
    };

    // modal for editing and adding a new status
    $scope.editStatus = function (status) {
      $modal.open({
        templateUrl: 'views/inventories/editStatus.html',
        windowClass: 'editInventoryStatusesModal',
        resolve: {
          status: function() {
            return status;
          }
        },
        controller: ['$scope', '$modalInstance', 'status', function($scope, $modalInstance, status) {
          $scope.status = status;

          $scope.close = function() {
            $modalInstance.close();
          };
        }]
      });
    };

    $scope.newSection = function() {
      var newSection = {title: 'Nova seção sem título', required: false, location: false, fields: []};

      $scope.category.sections.push(newSection);

      // NO NO NO THIS WASNT SUPPOSE TO BE HERE :(:(::())) ILL CRY FOREVA
      // PLS BE SMAR T AND PUT IN A DIRECTIVE
      // PLS
      $('html, body').animate({ scrollTop: $(document).height() }, 'slow');
    };

    // we add a new status and open the edit modal
    $scope.newStatus = function() {
      var status = {title: 'Novo estado sem título', color: '#259ECB'};

      var newStatus = $scope.category.statuses.push(status);

      $scope.editStatus($scope.category.statuses[newStatus - 1]);
    };

    $scope.removeStatus = function(status) {
      $scope.category.statuses.splice($scope.category.statuses.indexOf(status), 1);
    };

    $scope.$on('hidePopovers', function(event, data) {
      // tell each popover to close before opening a new one
      $scope.$broadcast('hideOpenPopovers', data);
    });

    $scope.send = function() {
      $scope.processingForm = true;

      if (updating)
      {
        var formattedData = {title: $scope.category.title, require_item_status: $scope.category.require_item_status, statuses: $scope.category.statuses}; // jshint ignore:line
        var formattedFormData = {sections: $scope.category.sections};

        var putCategoryPromise = Restangular.one('inventory').one('categories', categoryId).customPUT(formattedData);
        var putCategoryFormsPromise = Restangular.one('inventory').one('categories', categoryId).one('form').customPUT(formattedFormData);

        $q.all([putCategoryPromise, putCategoryFormsPromise]).then(function() {
          $scope.showMessage('ok', 'A categoria de inventário foi atualizada com sucesso!', 'success', true);

          $scope.unsavedCategory = false;
          $scope.processingForm = false;
        }, function() {
          $scope.showMessage('exclamation-sign', 'O item não pode ser criado. Por favor, revise os erros.', 'error', true);

          $scope.processingForm = false;
        });
      }
    };
  })
  .controller('InventoriesCategoriesSelectCtrl', function ($scope, Restangular) {
    $scope.loading = true;

    var categoriesPromise = Restangular.one('inventory').all('categories').getList();

    categoriesPromise.then(function(response) {
      $scope.categories = response.data;

      $scope.loading = false;
    });
  })
  .controller('InventoriesCategoriesItemEditCtrl', function ($routeParams, $scope, Restangular, $q, $location, $modal, $rootScope, $fileUploader) {
    var updating = $scope.updating = false;

    var categoryId = $routeParams.categoryId;
    var itemId = $routeParams.id;

    var itemData = $scope.itemData = {};

    if (typeof itemId !== 'undefined')
    {
      updating = true;
      $scope.updating = true;
    }

    $scope.loading = true;
    $scope.hiddenFields = [];
    $scope.imagesFieldId = null;
    var latLngIds = $scope.latLngIds = [];

    $scope.item = {inventory_status_id: null};

    var uploader = $scope.uploader = $fileUploader.create({
      scope: $scope
    });

    // Images only
    uploader.filters.push(function(item /*{File|HTMLInputElement}*/) {
      var type = uploader.isHTML5 ? item.type : '/' + item.value.slice(item.value.lastIndexOf('.') + 1);
      type = '|' + type.toLowerCase().slice(type.lastIndexOf('/') + 1) + '|';
      return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
    });

    var categoryPromise = Restangular.one('inventory').one('categories', categoryId).get({display_type: 'full'}); // jshint ignore:line

    categoryPromise.then(function(response) {
      $scope.category = response.data;

      // create an object with all the possible fields values
      for (var i = $scope.category.sections.length - 1; i >= 0; i--) {
        for (var j = $scope.category.sections[i].fields.length - 1; j >= 0; j--) {
          var section = $scope.category.sections[i];

          if (typeof section !== 'undefined')
          {
            // we leave as null for empty fields
            itemData[section.fields[j].id] = null;

            if (section.fields[j].kind === 'checkbox')
            {
              var optionsObj = {};

              // we leave all the options checked as blank
              /* jshint ignore:start */
              if (section.fields[j].available_values !== null)
              {
                for (var b = section.fields[j].available_values.length - 1; b >= 0; b--) {
                  optionsObj[section.fields[j].available_values[b]] = false;
                }
              }
              /* jshint ignore:end */

              itemData[section.fields[j].id] = optionsObj;
            }

            // detect location fields
            if (section.location === true)
            {
              if (section.fields[j].title === 'latitude')
              {
                $scope.latLngIds[0] = section.fields[j].id;
                $scope.hiddenFields.push(section.fields[j].id);
              }

              if (section.fields[j].title === 'longitude')
              {
                $scope.latLngIds[1] = section.fields[j].id;
                $scope.hiddenFields.push(section.fields[j].id);
              }
            }

            if (section.fields[j].kind === 'images')
            {
              $scope.imagesFieldId = section.fields[j].id;
            }
          }
        }
      }
    });

    if (updating)
    {
      var itemPromise = Restangular.one('inventory').one('categories', $routeParams.categoryId).one('items', $routeParams.id).get();

      $q.all([itemPromise, categoryPromise]).then(function(responses) {
        $scope.item = responses[0].data;

        var getDataByInventoryFieldId = function(id) {
          for (var i = $scope.item.data.length - 1; i >= 0; i--) {

            if ($scope.item.data[i].field.id == id) // jshint ignore:line
            {
              return $scope.item.data[i].content;
            }
          }
        };

        // populate itemData with item information
        for (var x in itemData)
        {
          var data = getDataByInventoryFieldId(x);

          // we detect if it's a checkbox by checking if the value is an array
          if (data instanceof Array)
          {
            for (var i = data.length - 1; i >= 0; i--) {
              itemData[x][data[i]] = true;
            }
          }
          else
          {
            itemData[x] = data;
          }
        }

        $scope.loading = false;
      });
    }
    else
    {
      categoryPromise.then(function() {
        $scope.loading = false;
      });
    }

    $scope.openMapModal = function () {
      var mapModalInstance =  $modal.open({
        templateUrl: 'views/inventories/items/modalMap.html',
        windowClass: 'mapModal',
        resolve: {
          category: function() {
            var deferred = $q.defer();

            $scope.$watch('loading', function() {
              if ($scope.loading === false)
              {
                deferred.resolve($scope.category);
              }
            });

            return deferred.promise;
          }
        },
        controller: ['$scope', '$modalInstance', 'category', function($scope, $modalInstance, category) {
          $scope.updating = updating;
          $scope.category = category;

          $scope.latLng = [itemData[latLngIds[0]], itemData[latLngIds[1]]];

          $scope.close = function() {
            $modalInstance.close();
          };

          $scope.save = function() {
            itemData[latLngIds[0]] = $scope.latLng[0];
            itemData[latLngIds[1]] = $scope.latLng[1];

            $modalInstance.close();
          };
        }]
      });

      mapModalInstance.opened.then(function () {
        setTimeout(function() {
          $rootScope.selectLatLngMap.start();
        }, 80);
      });
    };

    $scope.send = function() {
      $scope.processingForm = true;
      var images = [], promises = [];

      // process images
      function addAsync(file) {
        var deferred = $q.defer();

        var picReader = new FileReader();

        picReader.addEventListener('load', function(event) {
          var picFile = event.target;

          images.push(picFile.result.replace(/^data:image\/[^;]+;base64,/, ''));
          deferred.resolve();
        });

        // pass as base64 and strip data:image
        picReader.readAsDataURL(file);

        return deferred.promise;
      }

      for (var i = uploader.queue.length - 1; i >= 0; i--) {
        promises.push(addAsync(uploader.queue[i].file));
      }

      $q.all(promises).then(function() {
        var formattedData = {inventory_status_id: $scope.item.inventory_status_id, data: {}}; // jshint ignore:line

        // we need to format our data
        for (var x in itemData)
        {
          if (itemData[x] !== null)
          {
            if (typeof itemData[x] === 'object')
            {
              var selectedItems = [];

              for (var z in itemData[x])
              {
                if (itemData[x][z] === true)
                {
                  selectedItems.push(z);
                }
              }

              formattedData.data[x] = selectedItems;
            }
            else
            {
              formattedData.data[x] = itemData[x];
            }
          }
        }

        if ($scope.imagesFieldId !== null)
        {
          formattedData.data[$scope.imagesFieldId] = images;
        }

        if (updating)
        {
          var putCategoryPromise = Restangular.one('inventory').one('categories', categoryId).one('items', itemId).customPUT(formattedData);

          putCategoryPromise.then(function() {
            $scope.showMessage('ok', 'O item foi atualizado com sucesso!', 'success', true);

            $scope.processingForm = false;
          }, function(response) {
            $scope.showMessage('exclamation-sign', 'O item não pode ser criado. Por favor, revise os erros.', 'error', true);

            $scope.inputErrors = response.data.error;
            $scope.processingForm = false;
          });
        }
        else
        {
          var postCategoryPromise = Restangular.one('inventory').one('categories', categoryId).post('items', formattedData);

          postCategoryPromise.then(function() {
            $scope.showMessage('ok', 'O item foi criado com sucesso', 'success', true);

            $location.path('/inventories');
          }, function(response) {
            $scope.showMessage('exclamation-sign', 'O item não pode ser criado. Por favor, revise os erros.', 'error', true);

            $scope.inputErrors = response.data.error;
            $scope.processingForm = false;
          });
        }
      });
    };
  })
  .controller('InventoriesCategoriesItemCtrl', function ($scope, Restangular, $routeParams, $q, $location, $modal) {
    $scope.loading = true;

    var itemPromise = Restangular.one('inventory').one('categories', $routeParams.categoryId).one('items', $routeParams.id).get();
    var categoryPromise = Restangular.one('inventory').one('categories', $routeParams.categoryId).get({display_type: 'full'}); // jshint ignore:line

    $q.all([itemPromise, categoryPromise]).then(function(responses) {
      $scope.item = responses[0].data;
      $scope.category = responses[1].data;

      $scope.loading = false;
    });

    $scope.getDataByInventoryFieldId = function(id) {
      for (var i = $scope.item.data.length - 1; i >= 0; i--) {
        if ($scope.item.data[i].inventory_field_id === id) // jshint ignore:line
        {
          return $scope.item.data[i].content;
        }
      }
    };

    $scope.deleteItem = function (item, category) {
      $modal.open({
        templateUrl: 'views/inventories/items/removeItem.html',
        windowClass: 'removeModal',
        resolve: {
          item: function() {
            return item;
          },

          category: function() {
            return category;
          }
        },
        controller: ['$scope', '$modalInstance', 'item', 'category', function($scope, $modalInstance, item, category) {
          $scope.item = item;
          $scope.category = category;

          // delete user from server
          $scope.confirm = function() {
            var deletePromise = Restangular.one('inventory').one('categories', $scope.category.id).one('items', $scope.item.id).remove();

            deletePromise.then(function() {
              $modalInstance.close();

              $location.path('/inventories');
            });
          };

          $scope.close = function() {
            $modalInstance.close();
          };
        }]
      });
    };
  });
