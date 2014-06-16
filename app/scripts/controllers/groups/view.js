'use strict';

angular.module('zupPainelApp')

.controller('GroupsViewCtrl', function ($scope, Restangular, $routeParams, $q) {
  var groupId = $routeParams.id;

  $scope.loading = true;

  $scope.sort = {
    column: '',
    descending: false
  };

  $scope.changeSorting = function (column) {
    var sort = $scope.sort;
    if (sort.column === column) {
      sort.descending = !sort.descending;
    } else {
      sort.column = column;
      sort.descending = false;
    }
  };

  $scope.selectedCls = function (column) {
    return column === $scope.sort.column && 'sort-' + $scope.sort.descending;
  };

  var groupsPromise = Restangular.one('groups', groupId).get();
  var usersPromise = Restangular.one('groups', groupId).one('users').getList();

  // Get specific group
  $q.all([groupsPromise, usersPromise]).then(function(responses) {
    $scope.group = responses[0].data;
    $scope.users = responses[1].data;

    $scope.loading = false;
  });

});
