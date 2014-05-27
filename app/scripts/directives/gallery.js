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
              if (typeof $scope.images == 'undefined')
              {
                return false;
              }

              $scope.path = "src";
              $scope.tileWidth = 150;
              $scope.tileHeight = 150;

              $scope.displayImage = function (img) {
                  $scope.selected = $scope.images.indexOf(img);
                  $scope.selectedImg = img;
                  $scope.showModal = true;
              };

              $scope.source = function (img) {
                if (typeof img !== 'undefined')
                {
                  return img[$scope.path];
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
        }
    };
  });
/* jshint ignore:end */
