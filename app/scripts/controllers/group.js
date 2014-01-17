'use strict';

angular.module('zupPainelApp')

.controller('GroupCtrl', function ($scope, Groups) {

  // Get all groups
  Groups.getAll(function(data) {
    $scope.groups = data.groups;
  });
})

.controller('ViewGroupCtrl', function ($scope, Groups, $routeParams) {

  // Get specific group
  Groups.get({ id: $routeParams.id }, function(data) {
    $scope.group = data.group;
  });

});
