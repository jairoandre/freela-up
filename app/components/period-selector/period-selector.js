'use strict';

angular
  .module('PeriodSelectorModule', [])
  .controller('PeriodSelectorController', function($scope, $modalInstance, promise, openEnded) {
    $scope.openEnded = openEnded;
    $scope.period = {beginDate: new Date(), endDate: new Date(), tab: 'between'};

    $scope.save = function() {
      var result = [];

      if ($scope.period.tab === 'between' || $scope.period.tab === 'from')
      {
        result.push($scope.period.beginDate);
      }

      if ($scope.period.tab === 'between' || $scope.period.tab === 'to')
      {
        result.push($scope.period.endDate);
      }

      promise.resolve.apply(this, result);

      $modalInstance.close();
    };

    $scope.validRange = function(){
      if(!openEnded || $scope.period.tab == 'between')
        return $scope.period.beginDate <= $scope.period.endDate;
      return true;
    };

    $scope.close = function() {
      promise.reject();
      $modalInstance.close();
    };
  })
  .factory('PeriodSelectorService', function ($modal, $q) {
    return {
      open: function (openEnded) {
        var deferred = $q.defer();

        $modal.open({
          templateUrl: 'components/period-selector/period-selector.template.html',
          windowClass: 'periodSelectorModal',
          resolve: {
            promise: function () {
              return deferred;
            },

            openEnded: function(){
              return openEnded;
            }
          },
          controller: 'PeriodSelectorController'
        });

        return deferred.promise;
      }
    }
  });
