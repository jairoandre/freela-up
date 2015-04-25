'use strict';

angular
  .module('GroupsShowControllerModule', [
    'GroupsEditModalControllerModule',
    'GroupsAddUsersModalControllerModule',
    'GroupsRemoveUserModalControllerModule'
  ])

  .controller('GroupsShowController', function ($scope, Restangular, $stateParams, $q, $modal) {
    var groupId = $stateParams.id, page = 1, perPage = 15;

    $scope.loading = true;
    $scope.loadingPagination = false;
    $scope.total = 0;

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

    // Get specific group
    groupsPromise.then(function(response) {
      $scope.group = response.data;

      $scope.loading = false;
    });

    var getData = $scope.getData = function(paginate) {
      if ($scope.loadingPagination === false)
      {
        $scope.loadingPagination = true;

        var usersPromise = Restangular.all('search').one('groups', groupId).one('users').getList(null, { 'page': page, 'per_page': perPage, 'name': $scope.searchText });

        usersPromise.then(function(response) {
          if (paginate !== true)
          {
            $scope.users = response.data;
          }
          else
          {
            if (typeof $scope.users === 'undefined')
            {
              $scope.users = [];
            }

            for (var i = 0; i < response.data.length; i++) {
              $scope.users.push(response.data[i]);
            }

            // add up one page
            page++;
          }

          $scope.total = parseInt(response.headers().total);

          var lastPage = Math.ceil($scope.total / perPage);

          if (page === (lastPage + 1) && paginate === true)
          {
            $scope.loadingPagination = null;
          }
          else
          {
            $scope.loadingPagination = false;
          }

          $scope.loading = false;
        });

        return usersPromise;
      }
    };

    getData(true);

    $scope.search = function(text) {
      $scope.searchText = text;

      $scope.loadingPagination = false;
      $scope.loadingSearch = true;
      $scope.users = [];
      page = 1;

      var p = getData(true);

      p.then(function() {
        $scope.loadingSearch = false;
      });
    };

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
