'use strict';

angular.module('zupPainelApp')

.controller('UsersCtrl', function ($scope, $q, $routeParams, $modal, Restangular) {

  $scope.loading = true;

  var groupId = $routeParams.groupId, users;

  // pass group id to view
  if (typeof groupId !== 'undefined')
  {
    users = function() { return Restangular.one('groups', groupId).all('users').getList() };

    $scope.groupId = groupId;
  }
  else
  {
    users = function() { return Restangular.all('users').getList() };

    groupId = null;
  }

  var groups = Restangular.all('groups').getList();

  $q.all([users(), groups]).then(function(data) {
    $scope.users = data[0];
    $scope.groups = data[1];

    $scope.loading = false;
  });

  // Search function
  $scope.search = function(text) {
    $scope.loadingContent = true;

    var search;

    if (text == '')
    {
      search = users();
    }
    else if (groupId)
    {
      search = Restangular.one('search').one('groups', groupId).all('users').getList({name: text, email: text});
    }
    else
    {
      search = Restangular.one('search').all('users').getList({name: text, email: text});
    }

    search.then(function(data) {
      $scope.users = data;

      $scope.loadingContent = false;
    });
  };

  $scope.deleteUser = function (user) {
    $modal.open({
      templateUrl: 'removeUser.html',
      windowClass: 'removeModal',
      resolve: {
        usersList: function(){
          return $scope.users;
        }
      },
      controller: ['$scope', '$modalInstance', 'Users', 'usersList', function($scope, $modalInstance, Users, usersList) {
        $scope.user = user;

        // delete user from server
        $scope.confirm = function() {
          var user = Users.get({ id: $scope.user.id }, function() {
            user.$delete({ id: $scope.user.id }, function() {
              $modalInstance.close();

              // remove user from list
              usersList.splice(usersList.indexOf($scope.user), 1);
            });
          });
        };

        $scope.close = function() {
          $modalInstance.close();
        };
      }]
    });
  };

})

.controller('ViewUsersCtrl', function ($scope, Restangular, $routeParams) {

  $scope.loading = true;

  Restangular.one('users', $routeParams.id).get().then(function(data) {
    $scope.user = data;

    $scope.loading = false;
  });

});
