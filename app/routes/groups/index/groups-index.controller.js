'use strict';

angular
  .module('GroupsIndexControllerModule', [])

  .controller('GroupsIndexController', function ($scope, $modal, Restangular) {

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

          // delete user from server
          $scope.confirm = function() {
            var deletePromise = Restangular.one('groups', $scope.group.id).remove();

            deletePromise.then(function() {
              $modalInstance.close();

              // remove user from list
              groupsList.splice(groupsList.indexOf($scope.group), 1);
            });
          };

          $scope.close = function() {
            $modalInstance.close();
          };
        }]
      });
    };
  });
