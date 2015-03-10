'use strict';

angular
  .module('ItemsShowControllerModule', [
    'MapShowItemComponentModule',
    'MapViewStreetviewComponentModule',
    'GalleryComponentModule'
  ])

  .controller('ItemsShowController', function ($scope, Restangular, $q, $state, $modal, itemResponse, categoriesResponse, itemHistoryResponse) {
    $scope.item = itemResponse.data;

    for (var i = categoriesResponse.data.length - 1; i >= 0; i--) {
      if (categoriesResponse.data[i].id === $scope.item.inventory_category_id)
      {
        $scope.category = categoriesResponse.data[i];
      }
    }

    $scope.getDataByInventoryFieldId = function(id) {
      for (var i = $scope.item.data.length - 1; i >= 0; i--) {
        if (typeof $scope.item.data[i].field !== 'undefined' && $scope.item.data[i].field !== null && $scope.item.data[i].field.id === parseInt(id)) // jshint ignore:line
        {
          return $scope.item.data[i].content;
        }
      }

      return null;
    };

    $scope.getSelectedOptionsByFieldId = function(id) {
      for (var i = $scope.item.data.length - 1; i >= 0; i--) {
        if (typeof $scope.item.data[i].field !== 'undefined' && $scope.item.data[i].field !== null && $scope.item.data[i].field.id === parseInt(id)) // jshint ignore:line
        {
          return $scope.item.data[i].selected_options;
        }
      }

      return null;
    };

    $scope.editItemStatus = function (item, category) {
      $modal.open({
        templateUrl: 'views/inventories/items/editStatus.html',
        windowClass: 'editStatusModal',
        resolve: {
          item: function() {
            return item;
          },

          category: function() {
            return category;
          }
        },
        controller: ['$scope', '$modalInstance', 'category', 'item', function($scope, $modalInstance, category, item) {
          $scope.category = category;
          $scope.item = angular.copy(item);

          $scope.changeStatus = function(statusId) {
            $scope.item.inventory_status_id = statusId; // jshint ignore:line
          };

          $scope.save = function() {
            var changeStatusPromise = Restangular.all('inventory').one('categories', $scope.category.id).one('items', $scope.item.id).customPUT({ 'inventory_status_id': $scope.item.inventory_status_id }); // jshint ignore:line

            changeStatusPromise.then(function() {
              item.inventory_status_id = $scope.item.inventory_status_id; // jshint ignore:line

              $modalInstance.close();
            });
          };

          $scope.close = function() {
            $modalInstance.close();
          };
        }]
      });
    };

    $scope.deleteItem = function (item, category) {
      $modal.open({
        templateUrl: 'modals/items/destroy/items-destroy.template.html',
        windowClass: 'removeModal',
        resolve: {
          removeItemFromList: function() {
            return false;
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
  });
