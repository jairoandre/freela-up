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
      controller: ['$scope', '$modalInstance', function($scope, $modalInstance) {
        $scope.group = group;

        /** TO DO DELETE GROUP **/

        $scope.close = function() {
          $modalInstance.close();
        };
      }]
    });
  };
})

.controller('ViewGroupsCtrl', function ($scope, Restangular, $routeParams, $q) {
  var groupId = $routeParams.id;

  $scope.loading = true;

  var groupsPromise = Restangular.one('groups', groupId).get();
  var usersPromise = Restangular.one('groups', groupId).one('users').getList();

  // Get specific group
  $q.all([groupsPromise, usersPromise]).then(function(responses) {
    $scope.group = responses[0].data;
    $scope.users = responses[1].data;

    $scope.loading = false;
  });

});
