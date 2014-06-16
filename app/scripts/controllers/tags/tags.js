'use strict';

angular.module('zupPainelApp')

.controller('TagsCtrl', function ($scope, $modal) {
  $scope.open = function () {
    $modal.open({
      templateUrl: 'addTag.html',
      windowClass: 'tagModal',
      controller: ['$scope', '$modalInstance', function($scope, $modalInstance) {
        $scope.ok = function () {
          $modalInstance.close();
        };
      }]
    });
  };
});