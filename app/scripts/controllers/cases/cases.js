'use strict';

angular.module('zupPainelApp')

.controller('CasesCtrl', function ($scope, Restangular, $modal, $q) {
  $scope.currentTab = 'progress';
  $scope.loading = true;

  var page = 1, perPage = 30, total, searchText = '';

  $scope.loadingPagination = false;

  $scope.selectedFlows = [];

  var generateCasesPromise = function() {
    var url = Restangular.all('cases'), options = {'display_type': 'full'};

    // check if we have categories selected
    if ($scope.selectedFlows.length !== 0)
    {
      options.initial_flow_id = $scope.selectedFlows.join(); // jshint ignore:line
    }

    return url.getList(options);
  };

  var flowsPromise = Restangular.all('flows').getList({'display_type': 'full', 'initial': 'true'});

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

  var loadFilters = $scope.reload = function(reloading) {
    // reset pagination
    page = 1;
    $scope.loadingPagination = false;

    if (reloading === true)
    {
      $scope.reloading = true;
    }

    $scope.loadingContent = true;
    $scope.cases = [];

    getData().then(function() {
      $scope.loadingContent = false;

      if (reloading === true)
      {
        $scope.reloading = false;
      }

      page++;
    });
  };

  $scope.$watch('selectedFlows', function(newValue, oldValue) {
    if (newValue !== oldValue)
    {
      $scope.reload();
    }
  });
});
