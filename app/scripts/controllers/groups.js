'use strict';

angular.module('zupPainelApp')

.controller('GroupsCtrl', function ($scope, Groups) {

  $scope.loading = true;

  // Get all groups
  Groups.getAll(function(data) {
    $scope.groups = data.groups;

    $scope.loading = false;
  });
})

.controller('ViewGroupsCtrl', function ($scope, Groups, $routeParams) {

  $scope.loading = true;

  // Get specific group
  Groups.get({ id: $routeParams.id }, function(data) {
    $scope.group = data.group;

    $scope.loading = false;
  });

});
