'use strict';

angular.module('zupPainelApp')

.controller('FlowsViewCtrl', function ($scope, Restangular, $routeParams) {

  var flowId = $routeParams.id;

  $scope.loading = true;
  $scope.currentTab = 'steps'

  var flowPromise = Restangular.one('flows', flowId).get({'display_type': 'full'});

  flowPromise.then(function(response) {
    $scope.loading = false;

    $scope.flow = response.data;

    console.log(Restangular.stripRestangular($scope.flow));
  });

});
