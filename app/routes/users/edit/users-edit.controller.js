'use strict';

angular
  .module('UsersEditControllerModule', [
    'ngCpfCnpj',
    'EqualsComponentModule',
    'GroupsSelectorInlineModule'
  ])

  .controller('UsersEditController', function ($scope, $rootScope, Restangular, $stateParams, $location, groupsResponse, Error, moment) {
    var updating = $scope.updating = false;
    var userId = $stateParams.id;
    $scope.user = {groups: []};

    if (typeof userId !== 'undefined') {
      updating = true;
      $scope.updating = true;
    }

    $scope.loading = true;

    if (updating) {
      Restangular.one('users', userId).get().then(function (response) {
        $scope.user = response.data;
        $scope.user.birthdate = moment($scope.user.birthdate).format('DD/MM/YYYY');
        $scope.loading = false;
      });
    }
    else {
      var groups = Restangular.stripRestangular(groupsResponse.data);

      $scope.loading = false;

      for (var i = groups.length - 1; i >= 0; i--) {
        if (groups[i].name === 'Público') {
          $scope.user.groups.push(groups[i]);
        }
      }
    }

    $scope.send = function () {
      $scope.inputErrors = null;
      $scope.processingForm = true;
      $rootScope.resolvingRequest = true;

      var user = angular.copy($scope.user);

      if (user.birthdate) {
        user.birthdate = moment(user.birthdate, 'DD/MM/YYYY').toJSON();
      }

      var extraParams = {};
      if ($scope.should_generate_password) {
        delete user.password;
        delete user.password_confirmation;
        extraParams.generate_password = true;
      }

      user.groups_ids = _.pluck(user.groups, 'id');

      // remove unecessary data from the request
      delete user.groups;

      // PUT if updating and POST if creating a new user
      if (updating) {

        var putUserPromise = Restangular.one('users', userId).withHttpConfig({treatingErrors: true}).customPUT(user, null, extraParams);

        putUserPromise.then(function () {
          $scope.showMessage('ok', 'O usuário foi atualizado com sucesso', 'success', true);

          $scope.processingForm = false;
          $rootScope.resolvingRequest = false;
        }, function (response) {
          $scope.showMessage('exclamation-sign', 'O usuário não pode ser salvo', 'error', true);

          if (typeof response.data.error !== 'object') {
            Error.show(response);
          }
          else {
            $scope.inputErrors = response.data.error;
          }

          $scope.processingForm = false;
          $rootScope.resolvingRequest = false;
        });
      }
      else {
        extraParams.return_fields = 'id';

        var postUserPromise = Restangular.one('users').withHttpConfig({treatingErrors: true}).post(null, user, extraParams);

        postUserPromise.then(function () {
          $scope.showMessage('ok', 'O usuário foi criado com sucesso', 'success', true);

          $location.path('/users');

          $scope.processingForm = false;
          $rootScope.resolvingRequest = false;
        }, function (response) {
          $scope.showMessage('exclamation-sign', 'O usuário não pode ser criado', 'error', true);

          if (typeof response.data.error !== 'object') {
            Error.show(response);
          }
          else {
            $scope.inputErrors = response.data.error;
          }

          $scope.processingForm = false;
          $rootScope.resolvingRequest = false;
        });
      }
    };
  });
