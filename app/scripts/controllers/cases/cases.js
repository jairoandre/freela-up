'use strict';

angular.module('zupPainelApp')

.controller('CasesCtrl', function ($scope, Restangular, $modal, $q, $location) {
  $scope.currentTab = 'progress';

  var page = 1, perPage = 30, total, lastPage;

  $scope.selectedFlows = [];
  $scope.selectedSteps = [];

  var generateCasesPromise = function() {
    var url = Restangular.all('cases'), options = {'display_type': 'full', 'page': page, 'per_page': perPage};

    // check if we have categories selected
    if ($scope.selectedFlows.length !== 0)
    {
      options.initial_flow_id = $scope.selectedFlows.join(); // jshint ignore:line
    }

    // check if we have steps selected
    if ($scope.selectedSteps.length !== 0)
    {
      options.step_id = $scope.selectedSteps.join(); // jshint ignore:line
    }

    if ($scope.currentTab === 'finished')
    {
      options.completed = true;
    }

    return url.getList(options);
  };

  var getRequiredData = function() {
    var flowsPromise =  Restangular.all('flows').getList({'display_type': 'full', 'initial': 'true'});
    var casesPromise = generateCasesPromise();

    var promise = $q.all([casesPromise, flowsPromise]);

    promise.then(function(responses) {
      $scope.flows = responses[1].data;
      $scope.cases = responses[0].data;

      total = parseInt(responses[0].headers().total);
      lastPage = Math.ceil(total / perPage);

      // we need to have a $scope.steps with every step from all flows
      $scope.steps = [];

      for (var i = $scope.flows.length - 1; i >= 0; i--) {
        for (var j = $scope.flows[i].steps.length - 1; j >= 0; j--) {
          $scope.steps.push($scope.flows[i].steps[j]);
        };
      };

      console.log($scope.steps);

      page++;
    });

    return promise;
  };

  $scope.paginate = function()
  {
    if ((page !== (lastPage + 1)) && $scope.loadingPagination === false)
    {
      $scope.loadingPagination = true;

      var casesPromise = generateCasesPromise();

      casesPromise.then(function(response) {
        // we add our results to $scope.cases
        for (var i = 0; i < response.data.length; i++) {
          $scope.cases.push(response.data[i]);
        }

        // add up one page
        page++;

        // hide pagination loader
        $scope.loadingPagination = false;
      });

      return casesPromise;
    }
    else
    {
      // (loadingPagination === null) means all items were loaded
      $scope.loadingPagination = null;
    }
  };

  $scope.reload = function() {
    $scope.cases = [];
    $scope.loadingPagination = false;
    $scope.loadingContent = true;
    page = 1;

    $scope.paginate().then(function() {
      $scope.loadingContent = false;
    });
  };

  $scope.$watchCollection('[currentTab, selectedFlows, selectedSteps]', function(newValue, oldValue) {
    if (angular.equals(newValue, oldValue) === false)
    {
      $scope.reload();
    }
  });

  // get required data to start loading page
  $scope.loading = true;
  $scope.loadingPagination = false;

  getRequiredData().then(function() {
    $scope.loading = false;
  });

  // create case
  $scope.createCase = function(flow) {
    var postCasePromise = Restangular.all('cases').post({initial_flow_id: flow.id, step_id: flow.steps[0].id});

    postCasePromise.then(function(response) {
      $location.path('/cases/' + response.data.id);
    });
  };
});
