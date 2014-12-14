'use strict';

angular
  .module('GroupsShowControllerModule', [])

  .controller('GroupsShowController', function ($scope, Restangular, $stateParams, $q) {
    var groupId = $stateParams.id;

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

    $scope.removeUserFromGroup = function(user) {
      var deletePromise = Restangular.one('groups', groupId).all('users').remove({ user_id: user.id });

      deletePromise.then(function() {
        $scope.users.splice($scope.users.indexOf(user), 1);
      });
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
