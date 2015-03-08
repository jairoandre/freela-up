'use strict';

angular
  .module('ReportsAddControllerModule', [
    'ReportsSelectUserModalControllerModule',
    'ReportsCreateUserModalControllerModule',
    'ReportSearchMapComponentModule',
    'MapNewReportComponentModule',
    'NgThumbComponentModule'
  ])

  .controller('ReportsAddController', function ($scope, $rootScope, Restangular, $q, $modal, $state, FileUploader, reportCategoriesResponse, inventoriesCategoriesResponse) {
    var categories = reportCategoriesResponse.data;

    $scope.categories = [];

    for (var i = categories.length - 1; i >= 0; i--) {
      $scope.categories.push(categories[i]);

      if (categories[i].subcategories.length !== 0)
      {
        for (var j = categories[i].subcategories.length - 1; j >= 0; j--) {
          $scope.categories.push(categories[i].subcategories[j]);
        };
      }
    };

    // grouping function for ui-select2
    $scope.subCategories = function(item) {
      if (item.parent_id == null)
      {
        return 'Categorias principais';
      }

      if (item.parent_id !== null)
      {
        return 'Subcategorias';
      }
    };

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

    $scope.selectUser = function() {
      $modal.open({
        templateUrl: 'modals/reports/select-user/reports-select-user.template.html',
        windowClass: 'modal-reports-select-user',
        resolve: {
          setUser: function() {
            return function(user) {
              $scope.user = user;
            }
          },
        },
        controller: 'ReportsSelectUserModalController'
      });
    };

    $scope.registerUser = function() {
      $modal.open({
        templateUrl: 'modals/reports/create-user/reports-create-user.template.html',
        windowClass: 'modal-reports-create-user',
        resolve: {
          setUser: function() {
            return function(user) {
              $scope.user = user;
            }
          },
        },
        controller: 'ReportsCreateUserModalController'
      });
    };

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
      $rootScope.resolvingRequest = true;

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

        if ($scope.user)
        {
          newReport.user_id = $scope.user.id;
        }

        var newReportPromise = Restangular.one('reports', $scope.selectedCategory).customPOST(newReport, 'items');

        newReportPromise.then(function(response) {
          $scope.showMessage('ok', 'O relato foi criado com sucesso.', 'success', true);

          $state.go('reports.show', { id: response.data.id });
        });

      });
    };
  });
