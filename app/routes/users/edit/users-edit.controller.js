'use strict';

angular
  .module('UsersEditControllerModule', [])

  .controller('UsersEditController', function ($scope, $rootScope, Restangular, $stateParams, $location) {
    var updating = $scope.updating = false;
    var userId = $stateParams.id;

    if (typeof userId !== 'undefined')
    {
      updating = true;
      $scope.updating = true;
    }

    $scope.loading = true;

    if (updating)
    {
      Restangular.one('users', userId).get().then(function(response) {
        $scope.user = response.data;

        $scope.loading = false;
      });
    }
    else
    {
      $scope.loading = false;
      $scope.user = { groups: [] };
    }

    // groups autocomplete
    $scope.groupsAutocomplete = {
      options: {
        onlySelect: true,
        source: function( request, uiResponse ) {
          var categoriesPromise = Restangular.all('groups').getList({ name: request.term });

          categoriesPromise.then(function(response) {
            uiResponse( $.map( response.data, function( group ) {
              return {
                label: group.name,
                value: group.name,
                group: {id: group.id, name: group.name}
              };
            }));
          });
        },
        messages: {
          noResults: '',
          results: function() {}
        }
      }
    };

    $scope.groupsAutocomplete.events = {
      select: function( event, ui ) {
        var found = false;

        for (var i = $scope.user.groups.length - 1; i >= 0; i--) {
          if ($scope.user.groups[i].id === ui.item.group.id)
          {
            found = true;
          }
        }

        if (!found)
        {
          $scope.user.groups.push(ui.item.group);
        }
      },

      change: function() {
        $scope.group = '';
      }
    };

    $scope.removeGroup = function(group) {
      $scope.user.groups.splice($scope.user.groups.indexOf(group), 1);
    };

    $scope.send = function() {
      $scope.inputErrors = null;
      $scope.processingForm = true;
      $rootScope.resolvingRequest = true;

      var user = angular.copy($scope.user);

      // PUT if updating and POST if creating a new user
      if (updating)
      {
        var putUserPromise = Restangular.one('users', userId).withHttpConfig({ treatingErrors: true }).customPUT(user);

        putUserPromise.then(function() {
          $scope.showMessage('ok', 'O usuário foi atualizado com sucesso', 'success', true);

          $scope.processingForm = false;
          $rootScope.resolvingRequest = false;
        }, function(response) {
          $scope.showMessage('exclamation-sign', 'O usuário não pode ser salvo', 'error', true);

          if (typeof response.data.error !== 'object')
          {
            Error.show(response);
          }
          else
          {
            $scope.inputErrors = response.data.error;
          }

          $scope.processingForm = false;
          $rootScope.resolvingRequest = false;
        });
      }
      else
      {
        if (user.groups.length !== 0)
        {
          user.groups_ids = [];

          for (var i = user.groups.length - 1; i >= 0; i--) {
            user.groups_ids.push(user.groups[i].id);
          };
        }

        // remove unecessary data from the request
        delete user.groups;

        var postUserPromise = Restangular.one('users').withHttpConfig({ treatingErrors: true }).post(null, user);

        postUserPromise.then(function() {
          $scope.showMessage('ok', 'O usuário foi criado com sucesso', 'success', true);

          $location.path('/users');

          $scope.processingForm = false;
          $rootScope.resolvingRequest = false;
        }, function(response) {
          $scope.showMessage('exclamation-sign', 'O usuário não pode ser criado', 'error', true);

          if (typeof response.data.error !== 'object')
          {
            Error.show(response);
          }
          else
          {
            $scope.inputErrors = response.data.error;
          }

          $scope.processingForm = false;
          $rootScope.resolvingRequest = false;
        });
      }
    };
  });
