'use strict';

angular
  .module('GroupsShowControllerModule', [
    'GroupsEditModalControllerModule',
    'GroupsAddUsersModalControllerModule',
    'GroupsRemoveUserModalControllerModule'
  ])

  .controller('GroupsShowController', function ($scope, Restangular, $stateParams, $q, $modal) {
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
      $modal.open({
        templateUrl: 'modals/groups/remove-user/groups-remove-user.template.html',
        windowClass: 'removeModal',
        resolve: {
          group: function() {
            return $scope.group;
          },

          user: function() {
            return user;
          },

          removeUserFromList: function() {
            return function(user) {
              $scope.users.splice($scope.users.indexOf(user), 1);
            }
          }
        },
        controller: 'GroupsRemoveUserModalController'
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

    $scope.editGroup = function () {
      $modal.open({
        templateUrl: 'modals/groups/edit/groups-edit.template.html',
        windowClass: 'editStatusModal',
        resolve: {
          group: function() {
            return $scope.group;
          }
        },
        controller: 'GroupsEditModalController'
      });
    };

    $scope.addUsers = function () {
      $modal.open({
        templateUrl: 'modals/groups/add-users/groups-add-users.template.html',
        windowClass: 'modal-groups-select-user',
        resolve: {
          group: function() {
            return $scope.group;
          }
        },
        controller: 'GroupsAddUsersModalController'
      });
    };

  });
