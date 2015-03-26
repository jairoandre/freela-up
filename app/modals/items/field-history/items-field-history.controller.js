'use strict';

angular
  .module('FieldHistoryModalControllerModule', [])

  .controller('FieldHistoryModalController', function($rootScope, $scope, $modalInstance, Restangular, itemHistoryResponse, itemId, field) {
    $scope.historyLogs = itemHistoryResponse.data;
    $scope.field = field;
    $rootScope.resolvingRequest = false;

    // item history
    $scope.refreshHistory = function() {
      var options = { object_id: field.id };

      if ($scope.historyFilterBeginDate) options['created_at[begin]'] = $scope.historyFilterBeginDate;
      if ($scope.historyFilterEndDate) options['created_at[end]'] = $scope.historyFilterEndDate;

      $scope.loadingHistoryLogs = true;

      var historyPromise = Restangular.one('inventory').one('items', itemId).one('history').getList(null, options);

      historyPromise.then(function(historyLogs) {
        $scope.historyLogs = historyLogs.data;

        $scope.loadingHistoryLogs = false;
      });
    };

    $scope.availableHistoryDateFilters = [
      { name: 'Hoje', beginDate: moment().startOf('day').format(), endDate: moment().endOf('day').format(), selected: false },
      { name: 'Ontem', beginDate: moment().subtract(1, 'days').startOf('day').format(), endDate: moment().subtract(1, 'days').endOf('day').format(), selected: false },
      { name: 'Este mês', beginDate: moment().startOf('month').format(), endDate: moment().subtract(1, 'days').endOf('day').format(), selected: false },
      { name: 'Mês passado', beginDate: moment().subtract(1, 'months').startOf('month').format(), endDate: moment().subtract(1, 'months').subtract(1, 'days').endOf('day').format(), selected: false },
      { name: 'Todos', beginDate: null, endDate: null, selected: true }
    ];

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

    $scope.close = function() {
      clearData();
      $modalInstance.close();
    };
  });
