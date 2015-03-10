'use strict';

angular
  .module('ReportsCategoriesDestroyModalControllerModule', [])

  .controller('ReportsCategoriesDestroyModalController', function($scope, $modalInstance, Restangular, destroyCategory, category) {
    $scope.category = category;

    // delete user from server
    $scope.confirm = function() {
      var deletePromise = Restangular.one('reports').one('categories', $scope.category.id).remove();

      deletePromise.then(function() {
        $modalInstance.close();
        $scope.showMessage('ok', 'A categoria de relato foi removida com sucesso', 'success', true);

        // remove user from list
        destroyCategory($scope.category);
      });
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
