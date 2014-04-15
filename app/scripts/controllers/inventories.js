'use strict';

angular.module('zupPainelApp')
  .controller('InventoriesCtrl', function ($scope, $modal, Inventories, $q, Restangular, isMap) {

   $scope.loading = true;

    var page = 1, per_page = 30, total, searchText = '';

    $scope.loadingPagination = false;

    // Return right promise
    var generateItemsPromise = function(searchText) {
      // if we searching, hit search/users
      if (searchText != '')
      {
        return Restangular.one('search').all('items').getList({name: searchText, email: searchText, page: page, per_page: per_page});
      }

      return Restangular.one('inventory').all('items').getList({ page: page, per_page: per_page });
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
            if (typeof $scope.items == 'undefined')
            {
              $scope.items = [];
            }

            for (var i = 0; i < responses[0].data.length; i++) {
              $scope.items.push(responses[0].data[i]);
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

        return itemsPromise;
      }
    };

    if (isMap === true)
    {
      getData();
    }

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
  .controller('InventoriesCategoriesCtrl', function () {

  })
  .controller('InventoriesCategoriesEditCtrl', function () {

  })
  .controller('InventoriesCategoriesSelectCtrl', function ($scope, Restangular, $modal) {
    $scope.loading = true;

    var categoriesPromise = Restangular.one('inventory').all('categories').getList();

    categoriesPromise.then(function(response) {
      $scope.categories = response.data;

      $scope.loading = false;
    });
  })
  .controller('InventoriesCategoriesItemEditCtrl', function ($routeParams, $scope, Restangular) {
    var categoryId = $routeParams.categoryId;

    $scope.loading = true;

    var categoryPromise = Restangular.one('inventory').one('categories', categoryId).get({display_type: 'full'});

    categoryPromise.then(function(response) {
      $scope.category = response.data;

      $scope.loading = false;
    });
  })
  .controller('InventoriesCategoriesItemCtrl', function ($scope, Restangular, $routeParams, $q) {
    $scope.loading = true;

    var itemPromise = Restangular.one('inventory').one('categories', $routeParams.categoryId).one('items', $routeParams.id).get();
    var categoryPromise = Restangular.one('inventory').one('categories', $routeParams.categoryId).get({display_type: 'full'});

    $q.all([itemPromise, categoryPromise]).then(function(responses) {
      $scope.item = responses[0].data;
      $scope.category = responses[1].data;

      $scope.loading = false;
    });

    $scope.getDataByInventoryFieldId = function(id) {
      for (var i = $scope.item.data.length - 1; i >= 0; i--) {
        if ($scope.item.data[i].inventory_field_id === id)
        {
          return $scope.item.data[i].content;
        }
      };
    };
  });
