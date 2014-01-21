'use strict';

angular.module('zupPainelApp')

.controller('UsersCtrl', function ($scope, $q, $routeParams, Users, Groups) {

  var params = {}, groupId = $routeParams.groupId;

  // pass group id to view
  if (typeof groupId !== 'undefined')
  {
    params = {groups: groupId};

    $scope.groupId = groupId;
  }

  $scope.loading = true;

  // get all necessary data
  var usersData = Users.getAll(params, function(data) {
    $scope.users = data.users;
  });

  var groupsData = Groups.getAll(function(data) {
    $scope.groups = data.groups;
  });

  $q.all([usersData.$promise, groupsData.$promise]).then(function() {
    $scope.loading = false;
  });

  // Search function
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

    usersData = Users.getAll(params, function(data) {
      $scope.users = data.users;

      $scope.loadingContent = false;
    });
  };

})

.controller('ViewUsersCtrl', function ($scope, Users, $routeParams) {

  $scope.loading = true;

  // Get specific group
  Users.get({ id: $routeParams.id }, function(data) {
    $scope.user = data.user;

    $scope.loading = false;
  });

});
