'use strict';

angular
  .module('ItemsCategoriesEditOptionsModalControllerModule', [
    'NgThumbComponentModule'
  ])

  .controller('ItemsCategoriesEditOptionsModalController', function($scope, $modalInstance, category, uploaderQueue, FileUploader) {
    $scope.category = category;
    $scope.uploaderQueue = uploaderQueue;

    $scope.icon = category.original_icon; // jshint ignore:line

    // Image uploader
    var uploader = $scope.uploader = new FileUploader();

    // Images only
    uploader.filters.push({
      name: 'onlyImages',
      fn: function(item, options) {
        var type = uploader.isHTML5 ? item.type : '/' + item.value.slice(item.value.lastIndexOf('.') + 1);
        type = '|' + type.toLowerCase().slice(type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    uploader.onAfterAddingFile = function() {
      $scope.$apply(function() {
        $scope.uploaderQueue.items = uploader.queue;
      });
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
