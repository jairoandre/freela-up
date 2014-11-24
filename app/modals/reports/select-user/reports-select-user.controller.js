'use strict';

angular
  .module('ReportsSelectUserModalControllerModule', [])
  .controller('ReportsSelectUserModalController', function(Restangular, $scope, $modalInstance, $q, setUser) {
    $scope.loadingPagination = false;

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

    $scope.setUser = function(user) {
      setUser(user);

      $modalInstance.close();
    };

    var page = 1, perPage = 30, total, searchText = '';

    // Return right promise
    var generateUsersPromise = function() {
      if ($scope.groupId)
      {
        // if we are searching with a group, hit /search/groups/{id}/users
        if (searchText !== '')
        {
          return Restangular.one('search').one('groups', $scope.groupId).all('users').getList({name: searchText, email: searchText, page: page, per_page: perPage}); // jshint ignore:line
        }

        return Restangular.one('groups', $scope.groupId).all('users').getList({ page: page, per_page: perPage }); // jshint ignore:line
      }

      $scope.groupId = null;

      // if we searching, hit search/users
      if (searchText !== '')
      {
        return Restangular.one('search').all('users').getList({name: searchText, email: searchText, page: page, per_page: perPage}); // jshint ignore:line
      }

      return Restangular.all('users').getList({ page: page, per_page: perPage }); // jshint ignore:line
    };

    // Get groups for filters
    var groups = Restangular.all('groups').getList();

    // One every change of page or search, we create generate a new request based on current values
    var getData = $scope.getData = function(paginate) {
      if ($scope.loadingPagination === false)
      {
        $scope.loadingPagination = true;

        var usersPromise = generateUsersPromise();

        $q.all([usersPromise, groups]).then(function(responses) {
          $scope.groups = responses[1].data;

          if (paginate !== true)
          {
            $scope.users = responses[0].data;
          }
          else
          {
            if (typeof $scope.users === 'undefined')
            {
              $scope.users = [];
            }

            for (var i = 0; i < responses[0].data.length; i++) {
              $scope.users.push(responses[0].data[i]);
            }

            // add up one page
            page++;
          }

          total = parseInt(responses[0].headers().total);

          var lastPage = Math.ceil(total / perPage);

          if (page === (lastPage + 1))
          {
            $scope.loadingPagination = null;
          }
          else
          {
            $scope.loadingPagination = false;
          }
        });

        return usersPromise;
      }
    };

    // Search function
    $scope.search = function(text) {
      searchText = text;

      // reset pagination
      page = 1;
      $scope.loadingPagination = false;

      $scope.loadingContent = true;

      getData().then(function() {
        $scope.loadingContent = false;

        page++;
      });
    };

    $scope.selectGroup = function(groupId) {
      $scope.groupId = groupId;

      // reset pagination
      page = 1;
      $scope.loadingPagination = false;

      $scope.loadingContent = true;

      getData().then(function() {
        $scope.loadingContent = false;

        page++;
      });
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
