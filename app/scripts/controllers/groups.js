'use strict';

angular.module('zupPainelApp')

.controller('GroupsCtrl', function ($scope, $modal, Groups) {

  $scope.loading = true;

  var params = {};

  // Get all groups
  var groupsData = Groups.getAll(function(data) {
    $scope.groups = data.groups;

    $scope.loading = false;
  });

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

    groupsData = Groups.getAll(params, function(data) {
      $scope.groups = data.groups;

      $scope.loadingContent = false;
    });
  };

  $scope.deleteGroup = function (group) {
    $modal.open({
      templateUrl: 'removeGroup.html',
      windowClass: 'removeModal',
      resolve: {
        groupsList: function(){
          return $scope.groups;
        }
      },
      controller: ['$scope', '$modalInstance', 'groupsList', function($scope, $modalInstance, groupsList) {
        $scope.group = group;

        // delete user from server
        $scope.confirm = function() {
          var group = Groups.get({ id: $scope.group.id }, function() {
            group.$delete({ id: $scope.group.id }, function() {
              $modalInstance.close();

              // remove user from list
              groupsList.splice(groupsList.indexOf($scope.group), 1);
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

.controller('ViewGroupsCtrl', function ($scope, Groups, $routeParams) {

  $scope.loading = true;

  // Get specific group
  Groups.getUsers({ id: $routeParams.id }, function(data) {
    $scope.group = data.group;
    $scope.users = data.users;

    $scope.loading = false;
  });

});
