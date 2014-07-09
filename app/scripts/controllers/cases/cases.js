'use strict';

angular.module('zupPainelApp')

.controller('CasesCtrl', function ($scope, Restangular, $modal, $q) {
  $scope.currentTab = 'progress';
  $scope.loading = true;

  var page = 1, perPage = 30, total, searchText = '';

  $scope.loadingPagination = false;

  var generateCasesPromise = function() {
    var url = Restangular.all('cases');

    return url.getList();
  };

  var flowsPromise = Restangular.all('flows').getList();

  var getData = $scope.getData = function(paginate) {
    if ($scope.loadingPagination === false)
    {
      $scope.loadingPagination = true;

      var casesPromise = generateCasesPromise();

      $q.all([casesPromise, flowsPromise]).then(function(responses) {
        $scope.flows = responses[1].data;

        if (paginate !== true)
        {
          $scope.cases = responses[0].date;
        }
        else
        {
          if (typeof $scope.cases === 'undefined')
          {
            $scope.cases = [];
          }

          for (var i = 0; i < responses[0].data.length; i++) {
            $scope.cases.push(responses[0].data[i]);
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

      return casesPromise;
    }
  };

  $scope.selectConductor = function () {
    $modal.open({
      templateUrl: 'views/cases/selectConductor.html',
      windowClass: 'modalConductor'
    });
  };

  $scope.changeConductor = function () {
    $modal.open({
      templateUrl: 'views/cases/changeConductor.html',
      windowClass: 'modalConductor'
    });
  };
});
