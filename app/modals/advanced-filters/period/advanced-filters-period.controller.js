'use strict';

angular
  .module('AdvancedFiltersPeriodModalControllerModule', [])
  .controller('AdvancedFiltersPeriodModalController', function($scope, $modalInstance, activeAdvancedFilters) {
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
  });
