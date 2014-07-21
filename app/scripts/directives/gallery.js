'use strict';
// No patience to JSlint this :P
/* jshint ignore:start */
angular.module('zupPainelApp')
  .directive('gallery', function () {
    return {
        restrict: 'E',
        templateUrl: "views/layout/gallery.html",
        scope: {
            images: '='
        },
        replace: true,

        controller: function ($rootScope, $scope) {
            $scope.$watch('images', function() {
              if (typeof $scope.images == 'undefined' || $scope.images == null)
              {
                return false;
              }

              $scope.tileWidth = 150;
              $scope.tileHeight = 150;

              $scope.displayImage = function (img) {
                  $scope.selected = $scope.images.indexOf(img);
                  $scope.selectedImg = img;
                  $scope.showModal = true;
              };

              $scope.source = function (img) {
                if (typeof img !== 'undefined' && typeof img.versions !== 'undefined' && typeof img.versions.high !== 'undefined')
                {
                  return img.versions.high;
                }

                return '';
              };

              $scope.thumb = function (img) {
                if (typeof img !== 'undefined' && typeof img.versions !== 'undefined' && typeof img.versions.thumb !== 'undefined')
                {
                  return img.versions.thumb;
                }

                return '';
              };

              $scope.hasPrev = function () {
                  return ($scope.selected !== 0);
              };
              $scope.hasNext = function () {
                  return ($scope.selected < $scope.images.length - 1);
              };

              $scope.next = function () {
                  $scope.selected = $scope.selected + 1;
                  $scope.selectedImg = $scope.images[$scope.selected];
              };

              $scope.prev = function () {
                  $scope.selected = $scope.selected - 1;
                  $scope.selectedImg = $scope.images[$scope.selected];
              };
            });
        },

        link: function(scope, element) {
          element.find('.zoomableImage').bind('load', function() {
            // as soon as the image loads, let's calculate the proportions based on the user screen
            var loadLightbox = function(smartZoomImg) {
              if (smartZoomImg.smartZoom('isPluginActive'))
              {
                smartZoomImg.smartZoom('destroy');
              }

              var maxWidth = $('body').width() - 100, maxHeight = $('body').height() - 100;
              var imageWidth = smartZoomImg.width(), imageHeight = smartZoomImg.height();

              var ratio = Math.min(maxWidth / imageWidth, maxHeight / imageHeight);

              var proportionalWidth = imageWidth * ratio, proportionalHeight = imageHeight * ratio;

              element.find('.lightbox').css({width: proportionalWidth, marginTop: -(proportionalHeight / 2 + 30), marginLeft: -(proportionalWidth / 2)});
              element.find('.lightbox-image').height(proportionalHeight);

              smartZoomImg.smartZoom({'containerClass' : 'zoomContainer'});
            }

            loadLightbox($(this));

            // reset the zoom if user clicks prev/next
            var that = $(this);

            scope.$watch('showModal', function() {
              loadLightbox(that);
            });

            element.find('.lightbox-next, .lightbox-prev').click(function() {
              loadLightbox(that);
            });

            element.find('.zoomInButton, .zoomOutButton').bind('click', zoomButtonClickHandler);

            function zoomButtonClickHandler(e) {
              var scaleToAdd = 0.8;

              if($(e.target).attr('class') === 'zoomOutButton')
              {
                scaleToAdd = -scaleToAdd;
              }

              that.smartZoom("zoom", scaleToAdd);
            }
          });
        }
    };
  });
/* jshint ignore:end */
