'use strict';

angular
  .module('ReportsCreateUserModalControllerModule', [
    'ngCpfCnpj'
  ])

  .controller('ReportsCreateUserModalController', function (Restangular, $scope, moment, $modalInstance, $q, setUser) {
    $scope.user = {};

    $scope.inputErrors = null;

    $scope.create = function () {
      $scope.inputErrors = null;
      $scope.processingForm = true;

      if ($scope.user.birthdate) {
        $scope.user.birthdate = moment($scope.user.birthdate, 'DD/MM/YYYY').toJSON();
      }

      $scope.createUserPromise = Restangular.one('users').withHttpConfig({treatingErrors: true}).post(null, $scope.user, {
        return_fields: 'id,name',
        generate_password: true
      });

      $scope.createUserPromise.then(function (response) {
        setUser(Restangular.stripRestangular(response.data));
        $modalInstance.close();

        $scope.processingForm = false;
      }, function (response) {
        $scope.inputErrors = response.data.error;
        $scope.processingForm = false;
      });
    };

    $scope.close = function () {
      $modalInstance.close();
    };
  });
