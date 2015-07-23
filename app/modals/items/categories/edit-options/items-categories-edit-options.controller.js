'use strict';

angular
  .module('ItemsCategoriesEditOptionsModalControllerModule', [
    'NgThumbComponentModule'
  ])

  .controller('ItemsCategoriesEditOptionsModalController', function($scope, $modalInstance, category, uploaderQueue, FileUploader, singleItemUploaderFilter, onlyImagesUploaderFilter, send) {
    $scope.category = category;
    $scope.uploaderQueue = uploaderQueue;

    $scope.icon = category.original_icon; // jshint ignore:line

    // Image uploader
    var uploader = $scope.uploader = new FileUploader();

    // Images only
    uploader.filters.push(onlyImagesUploaderFilter(uploader.isHTML5));

    /**
     * @todo Bug on angular-file-upload
     * https://github.com/nervgh/angular-file-upload/issues/290
     */
    uploader.filters.push(singleItemUploaderFilter);

    uploader.onAfterAddingFile = function() {
      $scope.$apply(function() {
        $scope.uploaderQueue.items = uploader.queue;
      });
    };

    $scope.save = function() {
      var promise = send();
      promise.then(function() {
        $modalInstance.close();
      });
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
