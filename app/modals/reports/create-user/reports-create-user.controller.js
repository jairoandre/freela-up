'use strict';

angular
  .module('ReportsCreateUserModalControllerModule', [])
  .controller('ReportsCreateUserModalController', function(Restangular, $scope, $modalInstance, $q, setUser) {
    $scope.user = {};
    $scope.inputErrors = null;

    $scope.create = function() {
      $scope.inputErrors = null;
      $scope.processingForm = true;

      var postUserPromise = Restangular.one('users').post(null, $scope.user);

      postUserPromise.then(function(response) {
        setUser(Restangular.stripRestangular(response.data));
        $modalInstance.close();

        $scope.processingForm = false;
      }, function(response) {
        $scope.inputErrors = response.data.error;
        $scope.processingForm = false;
      });
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
