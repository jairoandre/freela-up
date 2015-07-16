'use strict';

angular
  .module('ItemsCategoriesEditOptionsModalControllerModule', [
    'NgThumbComponentModule'
  ])

  .controller('ItemsCategoriesEditOptionsModalController', function($scope, $modalInstance, category, uploaderQueue, FileUploader, send) {
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

    /**
     * @todo Bug on angular-file-upload
     * https://github.com/nervgh/angular-file-upload/issues/290
     */
    uploader.filters.push({
      name: 'fixQueueLimit',
      fn: function(item, options) {
        if(this.queue.length === 1) {
          this.clearQueue();
        }
        return true;
      }
    });

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
