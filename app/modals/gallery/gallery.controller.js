'use strict';

angular
  .module('GalleryModalControllerModule', [
    'panzoom',
    'panzoomwidget',
    'GalleryImageOnLoadComponentModule'
  ])

  .controller('GalleryModalController', function($scope, $modalInstance, image) {
    $scope.loading = true;
    $scope.image = image;

    $scope.panzoomConfig = {
      zoomLevels: 12,
      neutralZoomLevel: 5,
      scalePerZoomLevel: 1.5
    };

    $scope.panzoomModel = {};

    $scope.close = function() {
      $modalInstance.close();
    };
  });
