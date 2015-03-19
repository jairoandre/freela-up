'use strict';

angular
  .module('ReportsSelectAddressModalControllerModule', [
    'SelectLatLngMapComponent',
    'SearchLatLngMapComponent'
  ])

  .controller('ReportsSelectAddressModalController', function($scope, $modalInstance, $state, $rootScope, Restangular, category, report) {
    $scope.updating = true;
    $scope.category = category;

    $scope.latLng = [report.position.latitude, report.position.longitude];
    $scope.report = { reference: angular.copy(report.reference) };

    $scope.close = function() {
      $modalInstance.close();
    };

    $scope.save = function() {
      $modalInstance.close();
      $rootScope.resolvingRequest = true;

      var updatedData = {
        latitude: $scope.latLng[0],
        longitude: $scope.latLng[1],
        address: $scope.formattedAddress,
        reference: $scope.report.reference
      };

      var postUserPromise = Restangular.one('reports', report.category.id).one('items', report.id).customPUT(updatedData);

      postUserPromise.then(function(response) {
        $scope.showMessage('ok', 'O endereço do relato foi alterado com sucesso.', 'success', true);

        $state.go($state.current, {}, {reload: true});
      });
    };
  });
