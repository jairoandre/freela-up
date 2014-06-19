'use strict';

angular.module('zupPainelApp')

.controller('GroupsEditCtrl', function ($scope, Restangular, $routeParams, $location) {
  var updating = $scope.updating = false;
  var groupId = $routeParams.id;

  if (typeof groupId !== 'undefined')
  {
    updating = true;
    $scope.updating = true;
  }

  $scope.loading = true;

  if (updating)
  {
    Restangular.one('groups', $routeParams.id).get().then(function(response) {
      $scope.group = response.data;

      $scope.loading = false;
    });
  }
  else
  {
    $scope.loading = false;
    $scope.group = {};

    // available permissions
    $scope.group.permissions = {
      'manage_users': false,
      'manage_inventory_categories': false,
      'manage_inventory_items': false,
      'manage_groups': false,
      'manage_reports_categories': false,
      'manage_reports': false,
      'manage_flows': false,
      'view_categories': false,
      'view_sections': false,
    };

    // users autocomplete
    $scope.users = [];

    $scope.usersAutocomplete = {
      options: {
        onlySelect: true,
        source: function( request, uiResponse ) {
          var categoriesPromise = Restangular.one('search').all('users').getList({ name: request.term });

          categoriesPromise.then(function(response) {
            uiResponse( $.map( response.data, function( user ) {
              return {
                label: user.name,
                value: user.name,
                user: {id: user.id, name: user.name}
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

    $scope.usersAutocomplete.events = {
      select: function( event, ui ) {
        var found = false;

        for (var i = $scope.users.length - 1; i >= 0; i--) {
          if ($scope.users[i].id === ui.item.user.id)
          {
            found = true;
          }
        }

        if (!found)
        {
          $scope.users.push(ui.item.user);
        }
      },

      change: function() {
        $scope.user = '';
      }
    };

    $scope.removeUser = function(user) {
      $scope.users.splice($scope.users.indexOf(user), 1);
    };
  }

  $scope.send = function() {
    $scope.inputErrors = null;
    $scope.processingForm = true;

    // PUT if updating and POST if creating a new group
    if (updating)
    {
      var putUserPromise = Restangular.one('groups', groupId).customPUT($scope.group);

      putUserPromise.then(function() {
        $scope.showMessage('ok', 'O grupo foi atualizado com sucesso', 'success', true);

        $scope.processingForm = false;
      }, function(response) {
        $scope.showMessage('exclamation-sign', 'O grupo não pode ser salvo', 'error', true);

        $scope.inputErrors = response.data.error;
        $scope.processingForm = false;
      });
    }
    else
    {
      // let's create an array with the users id's
      $scope.group.users = [];

      for (var i = $scope.users.length - 1; i >= 0; i--) {
        $scope.group.users.push($scope.users[i].id);
      }

      var postUserPromise = Restangular.one('groups').post(null, $scope.group);

      postUserPromise.then(function() {
        $scope.showMessage('ok', 'O grupo foi criado com sucesso', 'success', true);

        $location.path('/groups');

        $scope.processingForm = false;
      }, function(response) {
        $scope.showMessage('exclamation-sign', 'O grupo não pode ser criado', 'error', true);

        $scope.inputErrors = response.data.error;
        $scope.processingForm = false;
      });
    }
  };
});
