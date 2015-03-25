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

    // item history
    var refreshHistory = function() {
      var options = {}, selectedFilters = $scope.selectedFilters();

      if (selectedFilters.length !== 0) options.kind = selectedFilters.join();

      if ($scope.historyFilterBeginDate) options['created_at[begin]'] = $scope.historyFilterBeginDate;
      if ($scope.historyFilterEndDate) options['created_at[end]'] = $scope.historyFilterEndDate;

      $scope.loadingHistoryLogs = true;

      var historyPromise = Restangular.one('inventory').one('items', $scope.item.id).one('history').getList(null, options);

      historyPromise.then(function(historyLogs) {
        $scope.historyLogs = historyLogs.data;

        $scope.loadingHistoryLogs = false;
      });
    };

    $scope.historyOptions = { type: undefined };
    $scope.availableHistoryFilters = [
      { type: 'report', name: 'Relatos', selected: true },
      { type: 'fields', name: 'Campos', selected: true },
      { type: 'images', name: 'Imagens', selected: true },
      { type: 'flow', name: 'Fluxo', selected: true },
      { type: 'formula', name: 'Fórmulas', selected: true },
      { type: 'status', name: 'Estados', selected: true }
    ];

    $scope.availableHistoryDateFilters = [
      { name: 'Hoje', beginDate: moment().startOf('day').format(), endDate: moment().endOf('day').format(), selected: false },
      { name: 'Ontem', beginDate: moment().subtract(1, 'days').startOf('day').format(), endDate: moment().subtract(1, 'days').endOf('day').format(), selected: false },
      { name: 'Este mês', beginDate: moment().startOf('month').format(), endDate: moment().subtract(1, 'days').endOf('day').format(), selected: false },
      { name: 'Mês passado', beginDate: moment().subtract(1, 'months').startOf('month').format(), endDate: moment().subtract(1, 'months').subtract(1, 'days').endOf('day').format(), selected: false },
      { name: 'Todos', beginDate: null, endDate: null, selected: true }
    ];

    $scope.selectedFilters = function() {
      var filters = [];

      _.each($scope.availableHistoryFilters, function(filter) {
        if (filter.selected) filters.push(filter.type);
      });

      return filters;
    };

    $scope.toggleOption = function(option) {
      option.selected = !option.selected;

      refreshHistory();
    };

    $scope.resetHistoryFilters = function() {
      _.each($scope.availableHistoryFilters, function(filter) {
        filter.selected = true;
      });

      refreshHistory();
    };

    $scope.selectDateFilter = function(filter) {
      _.each($scope.availableHistoryDateFilters, function(filter) {
        filter.selected = false;
      });

      filter.selected = !filter.selected;

      $scope.historyFilterBeginDate = filter.beginDate;
      $scope.historyFilterEndDate = filter.endDate;

      refreshHistory();
    };

    $scope.historyLogs = itemHistoryResponse.data;

  });
