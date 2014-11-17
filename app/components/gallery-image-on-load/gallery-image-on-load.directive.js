'use strict';

angular
  .module('GalleryImageOnLoadComponentModule', [])

  .directive('galleryImageOnLoad', function ($window, PanZoomService) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          element.bind('load', function() {
            var width = element.width();
            var height = element.height();

            scope.loading = false;

            scope.panzoomModel.pan.x = ($($window).width() / 2) - (width / 2);
            scope.panzoomModel.pan.y = ($($window).height() / 2) - (height / 2);

            PanZoomService.getAPI('PanZoom').then(function (api) {
              api.zoomToFit({ "x": 500, "y": 500, "width": 100, "height": 100 });
            });

            scope.$apply();
          });
        }
    };
  });
