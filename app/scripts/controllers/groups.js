'use strict';

angular.module('zupPainelApp')

.controller('GroupsCtrl', function ($scope, Groups) {

  $scope.loading = true;

  var params = {};

  // Get all groups
  var groupsData = Groups.getAll(function(data) {
    $scope.groups = data.groups;

    $scope.loading = false;
  });

  $scope.search = function(text) {
    if (text === '')
    {
      delete params.name;
    }
    else
    {
      params.name = text;
    }

    $scope.loadingContent = true;

    groupsData = Groups.getAll(params, function(data) {
      $scope.groups = data.groups;

      $scope.loadingContent = false;
    });
  };
})

.controller('ViewGroupsCtrl', function ($scope, Groups, $routeParams) {

  $scope.loading = true;

  // Get specific group
  Groups.getUsers({ id: $routeParams.id }, function(data) {
    $scope.group = data.group;
    $scope.users = data.users;

    $scope.loading = false;
  });

});
