'use strict';

angular
  .module('ItemsShowControllerModule', [
    'MapShowItemComponentModule',
    'MapViewStreetviewComponentModule',
    'FieldHistoryModalControllerModule',
    'GalleryComponentModule'
  ])

  .controller('ItemsShowController', function ($rootScope, $scope, Restangular, $q, $state, $modal, itemResponse, categoriesResponse, itemHistoryResponse) {
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

    // TODO: Make this as a component
    $scope.editItemStatus = function (item, category) {
      $modal.open({
        templateUrl: 'modals/items/edit-status/items-edit-status.template.html',
        windowClass: 'editStatusModal',
        resolve: {
          item: function() {
            return item;
          },

          category: function() {
            return category;
          },

          refreshItemHistory: function() {
            return $scope.refreshHistory;
          }
        },
        controller: ['$scope', '$modalInstance', 'category', 'item', 'refreshItemHistory', function($scope, $modalInstance, category, item, refreshItemHistory) {
          $scope.category = category;
          $scope.item = angular.copy(item);

          $scope.changeStatus = function(statusId) {
            $scope.item.inventory_status_id = statusId; // jshint ignore:line
          };

          $scope.save = function() {
            var changeStatusPromise = Restangular.all('inventory').one('categories', $scope.category.id).one('items', $scope.item.id).customPUT({ 'inventory_status_id': $scope.item.inventory_status_id }); // jshint ignore:line

            changeStatusPromise.then(function() {
              item.inventory_status_id = $scope.item.inventory_status_id; // jshint ignore:line

              refreshItemHistory();

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

    // TODO: Component should me ItemsFieldHistoryModalController
    $scope.showFieldHistory = function(field) {
      $rootScope.resolvingRequest = true;

      $modal.open({
        templateUrl: 'modals/items/field-history/items-field-history.template.html',
        windowClass: 'field-history-modal',
        resolve: {
          field: function() {
            return field;
          },

          itemId: function() {
            return $scope.item.id;
          },

          'itemHistoryResponse': ['Restangular', '$stateParams', function(Restangular, $stateParams) {
            return Restangular.one('inventory').one('items', $scope.item.id).one('history').getList(null, { object_id: field.id });
          }]
        },
        controller: 'FieldHistoryModalController'
      });
    };

    // item history
    $scope.refreshHistory = function() {
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
      { type: 'report', name: 'Relatos', selected: false },
      { type: 'fields', name: 'Campos', selected: false },
      { type: 'images', name: 'Imagens', selected: false },
      { type: 'flow', name: 'Fluxo', selected: false },
      { type: 'formula', name: 'Fórmulas', selected: false },
      { type: 'status', name: 'Estados', selected: false }
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

      $scope.refreshHistory();
    };

    $scope.resetHistoryFilters = function() {
      _.each($scope.availableHistoryFilters, function(filter) {
        filter.selected = true;
      });

      $scope.refreshHistory();
    };

    $scope.showCustomDateFields = function() {
      _.each($scope.availableHistoryDateFilters, function(filter) {
        filter.selected = false;
      });

      $scope.showCustomDateHelper = true;
    };

    $scope.selectDateFilter = function(filter) {
      _.each($scope.availableHistoryDateFilters, function(filter) {
        filter.selected = false;
      });

      filter.selected = !filter.selected;

      $scope.historyFilterBeginDate = filter.beginDate;
      $scope.historyFilterEndDate = filter.endDate;

      $scope.showCustomDateHelper = false;

      $scope.refreshHistory();
    };

    $scope.historyLogs = itemHistoryResponse.data;

  });
