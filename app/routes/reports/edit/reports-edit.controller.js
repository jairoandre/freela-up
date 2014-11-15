'use strict';

angular
  .module('ReportsEditControllerModule', [
    'ReportSearchMapComponentModule',
    'MapNewReportComponentModule',
    'NgThumbComponentModule'
  ])

  .controller('ReportsEditController', function ($scope, $rootScope, Restangular, $q, $modal, $state, FileUploader, reportCategoriesResponse, inventoriesCategoriesResponse) {
    $scope.categories = reportCategoriesResponse.data;
    $scope.inventoryCategories = inventoriesCategoriesResponse.data;

    $scope.uploader = new FileUploader();
    $scope.selectedCategory = null;

    $scope.uploader.filters.push({
      name: 'onlyImages',
      fn: function(item, options) {
        var type = $scope.uploader.isHTML5 ? item.type : '/' + item.value.slice(item.value.lastIndexOf('.') + 1);
        type = '|' + type.toLowerCase().slice(type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    $scope.getInventoryCategory = function(id) {
      for (var i = $scope.inventoryCategories.length - 1; i >= 0; i--) {
        if ($scope.inventoryCategories[i].id === id)
        {
          return $scope.inventoryCategories[i];
        }
      }

      return null;
    };

    $scope.$watch('selectedCategory', function(newValue, oldValue) {
      if (newValue !== oldValue)
      {
        for (var i = $scope.categories.length - 1; i >= 0; i--) {
          if ($scope.categories[i].id === parseInt($scope.selectedCategory))
          {
            return $scope.categoryData = $scope.categories[i];
          }

          // we search into subcategories
          if ($scope.categories[i].subcategories.length !== 0)
          {
            for (var j = $scope.categories[i].subcategories.length - 1; j >= 0; j--) {
              if ($scope.categories[i].subcategories[j].id === parseInt($scope.selectedCategory))
              {
                return $scope.categoryData = $scope.categories[i].subcategories[j];
              }
            };
          }
        };
      }
    });

    var addAsyncImage = function(img) {
      var deferred = $q.defer();

      var picReader = new FileReader();

      picReader.addEventListener('load', function(event) {
        var picFile = event.target;

        deferred.resolve(picFile.result.replace(/^data:image\/[^;]+;base64,/, ''));
      });

      // pass as base64 and strip data:image
      picReader.readAsDataURL(img);

      return deferred.promise;
    };

    $scope.send = function() {
      $rootScope.resolvingRoute = true;

      var imagesPromises = [];

      for (var i = $scope.uploader.queue.length - 1; i >= 0; i--) {
        imagesPromises.push(addAsyncImage($scope.uploader.queue[i]._file));
      };

      $q.all(imagesPromises).then(function(images) {
        var newReport = {
          latitude: $scope.lat,
          longitude: $scope.lng,
          inventory_item_id: $scope.itemId,
          description: $scope.description,
          address: $scope.formattedAddress,
          images: images
        };

        var newReportPromise = Restangular.one('reports', $scope.selectedCategory).customPOST(newReport, 'items');

        newReportPromise.then(function(response) {
          $scope.showMessage('ok', 'O relato foi criado com sucesso.', 'success', true);

          $state.go('reports.show', { id: response.data.id });
        });

      });
    };
  });
