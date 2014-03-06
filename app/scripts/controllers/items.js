'use strict';

angular.module('zupPainelApp')

.controller('ItemsCtrl', function ($scope, $modal, Inventories, $q) {

  $scope.loading = true;

  var params = {};

  // Get inventory categories
  var categoriesData = Inventories.get(function(data) {
    $scope.categories = data.categories;
  });

  // Get all groups
  var itemsData = Inventories.getItems({per_page: 100, limit: 100}, function(data) {
    $scope.items = data.items;
  });

  // Wait for all categories to load
  $q.all([itemsData.$promise, categoriesData.$promise]).then(function() {
    $scope.loading = false;
  });

  $scope.getInventoryCategory = function(id) {
    for (var i = $scope.categories.length - 1; i >= 0; i--) {
      if ($scope.categories[i].id === id)
      {
        return $scope.categories[i];
      }
    }

    return null;
  };

  $scope.search = function(text) {
    if (text === '')
    {
      delete params.name;
    }
    else
    {
      params.name = text;
    }

    $scope.loadingContent = true;

    groupsData = Groups.getAll(params, function(data) {
      $scope.groups = data.groups;

      $scope.loadingContent = false;
    });
  };

  $scope.deleteItem = function (item, category) {
    $modal.open({
      templateUrl: 'views/items/removeItem.html',
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
          Inventories.deleteItem({ categoryId: $scope.category.id, id: $scope.item.id }, function() {
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

.controller('ViewItemCtrl', function ($scope, Inventories, $routeParams, $q) {

  $scope.loading = true;

  var categoryData = Inventories.get({id: $routeParams.categoryId}, function(data) {
    $scope.category = data.category;
  });

  // Get specific group
  var itemData = Inventories.getItem({ categoryId: $routeParams.categoryId, id: $routeParams.id }, function(data) {
    $scope.item = data.item;
  });

  $scope.getDataByInventoryFieldId = function(id) {
    for (var i = $scope.item.data.length - 1; i >= 0; i--) {
      if ($scope.item.data[i].inventory_field_id === id)
      {
        return $scope.item.data[i].content;
      }
    };
  };

  $q.all([categoryData.$promise, itemData.$promise]).then(function() {
    $scope.loading = false;
  });
});
