'use strict';

angular.module('zupPainelApp')

.controller('InventoriesItemCtrl', function ($scope, Restangular, $routeParams, $q, $location, $modal) {
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
      if ($scope.item.data[i].field.id === id) // jshint ignore:line
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
