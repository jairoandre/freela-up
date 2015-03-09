'use strict';

angular
  .module('GroupsEditControllerModule', [])

  .controller('GroupsEditController', function ($scope, Restangular, $stateParams, $location, $q) {
    var groupId = $stateParams.id;

    // we get all data that is necessary for each permission
    var groupsPromise = Restangular.all('groups').getList();
    var reportsCategoriesPromise = Restangular.one('reports').all('categories').getList({ display_type: 'full' });
    var inventoryCategoriesPromise = Restangular.one('inventory').all('categories').getList();
    var flowsPromise = Restangular.all('flows').getList();

    var promises = [groupsPromise, reportsCategoriesPromise, inventoryCategoriesPromise, flowsPromise];

    $q.all(promises).then(function(responses) {
      $scope.data.groups = responses[0].data;
      $scope.data.reportsCategories = responses[1].data;
      $scope.data.inventoryCategories = responses[2].data;
      $scope.data.flows = responses[3].data;
    });
  });
