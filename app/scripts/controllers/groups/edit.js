'use strict';

angular.module('zupPainelApp')

.controller('GroupsEditCtrl', function ($scope, Restangular, $routeParams, $location, $q) {
  var updating = $scope.updating = false;
  var groupId = $routeParams.id;

  if (typeof groupId !== 'undefined')
  {
    updating = true;
    $scope.updating = true;
  }

  $scope.loading = true;
  $scope.data = {};
  $scope.group = {};
  $scope.tab = 'groups_can_edit';

  // available permissions in it's default
  $scope.permissions = {
    'manage_users': false,
    'manage_groups': false,
    'manage_inventory_categories': false,
    'manage_inventory_items': false,
    'manage_reports_categories': false,
    'manage_reports': false,
    'manage_flows': false,
    'flow_can_view_all_steps': {},
    'flow_can_execute_all_steps': {},
    'flow_can_delete_own_cases': {},
    'flow_can_delete_all_cases': {},
    'can_view_step': {},
    'can_execute_step': {},
    'groups_can_edit': {},
    'groups_can_view': {},
    'reports_categories_can_edit': {},
    'reports_categories_can_view': {},
    'inventory_categories_can_edit': {},
    'inventory_categories_can_view': {},
    'inventory_sections_can_view': {},
    'inventory_sections_can_edit': {},
    'inventory_fields_can_view': {},
    'inventory_fields_can_edit': {},
  };

  // we get all data that is necessary for each permission
  var groupsPromise = Restangular.all('groups').getList();
  var reportsCategoriesPromise = Restangular.one('reports').all('categories').getList();

  var promises = [groupsPromise, reportsCategoriesPromise];

  $q.all(promises).then(function(responses) {
    $scope.data.groups = responses[0].data;
    $scope.data.reportsCategories = responses[1].data;
  });

  if (updating)
  {
    var groupPromise = Restangular.one('groups', $routeParams.id).get();

    $q.all([groupPromise].concat(promises)).then(function(responses) {
      $scope.group = responses[0].data;

      // update permissions with existing ones
      for (var permission in $scope.group.permissions)
      {
        if ($scope.group.permissions[permission] instanceof Array)
        {
          var valuesObj = {};

          for (var p = $scope.group.permissions[permission].length - 1; p >= 0; p--) {
            valuesObj[$scope.group.permissions[permission][p]] = true;
          }

          $scope.permissions[permission] = valuesObj;
        }
        else
        {
          $scope.permissions[permission] = $scope.group.permissions[permission];
        }
      }

      $scope.loading = false;
    });
  }
  else
  {
    $q.all(promises).then(function() {
      $scope.loading = false;
    });
  }

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

  $scope.send = function() {
    $scope.inputErrors = null;
    $scope.processingForm = true;

    // we transform our $scope.permissions object to pass only id's
    $scope.group.permissions = {};

    for (var key in $scope.permissions)
    {
      if ($scope.permissions[key] === true)
      {
        $scope.group.permissions[key] = true;
      }

      if (typeof $scope.permissions[key] === 'object' && $scope.permissions[key].length !== 0)
      {
        $scope.group.permissions[key] = [];

        for (var id in $scope.permissions[key])
        {
          if ($scope.permissions[key][id] === true)
          {
            $scope.group.permissions[key].push(id);
          }
        }
      }
    }

    // let's create an array with the users id's
    $scope.group.users = [];

    for (var i = $scope.users.length - 1; i >= 0; i--) {
      $scope.group.users.push($scope.users[i].id);
    }

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
