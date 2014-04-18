'use strict';

angular.module('zupPainelApp')

.controller('GroupsCtrl', function ($scope, $modal, Restangular) {

  $scope.loading = true;

  var groupsPromise = Restangular.all('groups').getList();

  // Get all groups
  groupsPromise.then(function(response) {
    $scope.groups = response.data;

    $scope.loading = false;
  });

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

        /** TO DO DELETE GROUP **/

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
