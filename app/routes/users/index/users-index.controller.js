'use strict';

angular
  .module('UsersIndexControllerModule', [
    'KeyboardPosterComponentModule',
    'GenericInputComponentModule',
    'UsersDisableModalControllerModule',
    'FilterGroupModalControllerModule'
  ])

  .controller('UsersIndexController', function ($scope, $q, $stateParams, $modal, Restangular, groupsResponse) {
    $scope.loading = true;
    $scope.loadingPagination = false;

    var page = 1, perPage = 30, total, searchText = '', groupsIds = [];

    // Return right promise
    var generateUsersPromise = function() {
      var options = {page: page, per_page: perPage, disabled: true, 'return_fields': 'id,name,disabled,email,phone,groups.id'};

      if (groupsIds.length !== 0)
      {
        options['groups'] = groupsIds.join();
      }

      if (searchText.length !== 0)
      {
        options.name = searchText;
        options.email = searchText;
        options.document = searchText.replace(/\.|-/g, '');
      }

      return Restangular.one('search').all('users').getList(options);
    };

    // Get groups for filters
    $scope.groups = groupsResponse.data;

    $scope.getGroupsExcerpt = function() {
      switch(groupsIds.length) {
        case 1:
          return 'Grupo: ' + _.findWhere($scope.groups, { id: groupsIds[0] }).name;
          break;

        case 0:
          return 'Filtrar por grupo';
          break;

        default:
           return 'Grupo: ' + groupsIds.length + ' grupos selecionados';
      }
    };

    $scope.getGroupNameById = function(id){
      return $scope.groups[id].name;
    };

    // One every change of page or search, we create generate a new request based on current values
    var getData = $scope.getData = function(paginate) {
      if ($scope.loadingPagination === false)
      {
        $scope.loadingPagination = true;

        var usersPromise = generateUsersPromise();

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

          total = parseInt(response.headers().total);

          var lastPage = Math.ceil(total / perPage);

          if (page === (lastPage + 1))
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

    var refresh = function() {
      page = 1;

      $scope.loadingPagination = false;
      $scope.loadingSearch = true;
      $scope.users = [];

      getData(false).then(function() {
        $scope.loadingSearch = false;

        page++;
      });
    };

    // Search function
    $scope.search = function(text) {
      searchText = text;

      // reset pagination
      refresh();
    };

    $scope.filterUsersByGroup = function () {
      $modal.open({
        templateUrl: 'modals/users/filter-group/users-filter-group.template.html',
        windowClass: 'filterCategoriesModal',
        resolve: {
          groups: function() {
            return $scope.groups;
          },

          selectedGroups: function() {
            return angular.copy(groupsIds);
          },

          applyFilter: function() {
            return function(selectedGroupsIDs) {
              groupsIds = selectedGroupsIDs;

              refresh();
            }
          }
        },
        controller: 'FilterGroupModalController'
      });
    };

    $scope.disableUser = function (user) {
      $modal.open({
        templateUrl: 'modals/users/disable/users-disable.template.html',
        windowClass: 'removeModal',
        resolve: {
          user: function() {
            return user;
          }
        },
        controller: 'UsersDisableModalController'
      });
    };

    $scope.enableUser = function(user) {
      user.loading = true;

      var enableUserPromise = Restangular.one('users', user.id).customPUT({}, 'enable');

      enableUserPromise.then(function() {
        user.disabled = false;
        user.loading = false;

        $scope.showMessage('ok', 'O Usuário ' + user.name + ' foi ativado com sucesso.', 'success', false);
      });
    };
  });
