'use strict';

angular.module('zupPainelApp')

.controller('UsersEditCtrl', function ($scope, Restangular, $routeParams, $location) {
  var updating = $scope.updating = false;
  var userId = $routeParams.id;

  if (typeof userId !== 'undefined')
  {
    updating = true;
    $scope.updating = true;
  }

  $scope.loading = true;

  if (updating)
  {
    Restangular.one('users', $routeParams.id).get().then(function(response) {
      $scope.user = response.data;

      $scope.loading = false;
    });
  }
  else
  {
    $scope.loading = false;
    $scope.user = {};
  }

  $scope.send = function() {
    $scope.inputErrors = null;
    $scope.processingForm = true;

    // PUT if updating and POST if creating a new user
    if (updating)
    {
      var putUserPromise = Restangular.one('users', userId).customPUT($scope.user);

      putUserPromise.then(function() {
        $scope.showMessage('ok', 'O usuário foi atualizado com sucesso', 'success', true);

        $scope.processingForm = false;
      }, function(response) {
        $scope.showMessage('exclamation-sign', 'O usuário não pode ser salvo', 'error', true);

        $scope.inputErrors = response.data.error;
        $scope.processingForm = false;
      });
    }
    else
    {
      var postUserPromise = Restangular.one('users').post(null, $scope.user);

      postUserPromise.then(function() {
        $scope.showMessage('ok', 'O usuário foi criado com sucesso', 'success', true);

        $location.path('/users');

        $scope.processingForm = false;
      }, function(response) {
        $scope.showMessage('exclamation-sign', 'O usuário não pode ser criado', 'error', true);

        $scope.inputErrors = response.data.error;
        $scope.processingForm = false;
      });
    }
  };
});
