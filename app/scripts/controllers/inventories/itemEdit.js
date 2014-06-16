'use strict';

angular.module('zupPainelApp')

.controller('InventoriesItemEditCtrl', function ($routeParams, $scope, Restangular, $q, $location, $modal, $rootScope, $fileUploader) {
  var updating = $scope.updating = false;

  var categoryId = $routeParams.categoryId;
  var itemId = $routeParams.id;

  var itemData = $scope.itemData = {};

  if (typeof itemId !== 'undefined')
  {
    updating = true;
    $scope.updating = true;
  }

  $scope.loading = true;
  $scope.hiddenFields = [];
  $scope.imagesFieldId = null;
  var latLngIds = $scope.latLngIds = [];

  $scope.item = {inventory_status_id: null}; // jshint ignore:line

  var uploader = $scope.uploader = $fileUploader.create({
    scope: $scope
  });

  // Images only
  uploader.filters.push(function(item /*{File|HTMLInputElement}*/) {
    var type = uploader.isHTML5 ? item.type : '/' + item.value.slice(item.value.lastIndexOf('.') + 1);
    type = '|' + type.toLowerCase().slice(type.lastIndexOf('/') + 1) + '|';
    return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
  });

  var categoryPromise = Restangular.one('inventory').one('categories', categoryId).get({display_type: 'full'}); // jshint ignore:line

  categoryPromise.then(function(response) {
    $scope.category = response.data;

    // create an object with all the possible fields values
    for (var i = $scope.category.sections.length - 1; i >= 0; i--) {
      for (var j = $scope.category.sections[i].fields.length - 1; j >= 0; j--) {
        var section = $scope.category.sections[i];

        if (typeof section !== 'undefined')
        {
          // we leave as null for empty fields
          itemData[section.fields[j].id] = null;

          if (section.fields[j].kind === 'checkbox')
          {
            var optionsObj = {};

            // we leave all the options checked as blank
            /* jshint ignore:start */
            if (section.fields[j].available_values !== null)
            {
              for (var b = section.fields[j].available_values.length - 1; b >= 0; b--) {
                optionsObj[section.fields[j].available_values[b]] = false;
              }
            }
            /* jshint ignore:end */

            itemData[section.fields[j].id] = optionsObj;
          }

          // detect location fields
          if (section.location === true)
          {
            if (section.fields[j].title === 'latitude')
            {
              $scope.latLngIds[0] = section.fields[j].id;
              $scope.hiddenFields.push(section.fields[j].id);
            }

            if (section.fields[j].title === 'longitude')
            {
              $scope.latLngIds[1] = section.fields[j].id;
              $scope.hiddenFields.push(section.fields[j].id);
            }
          }

          if (section.fields[j].kind === 'images')
          {
            $scope.imagesFieldId = section.fields[j].id;
          }
        }
      }
    }
  });

  if (updating)
  {
    var itemPromise = Restangular.one('inventory').one('categories', $routeParams.categoryId).one('items', $routeParams.id).get();

    $q.all([itemPromise, categoryPromise]).then(function(responses) {
      $scope.item = responses[0].data;

      var getDataByInventoryFieldId = function(id) {
        for (var i = $scope.item.data.length - 1; i >= 0; i--) {

          if ($scope.item.data[i].field.id == id) // jshint ignore:line
          {
            return $scope.item.data[i].content;
          }
        }
      };

      // populate itemData with item information
      for (var x in itemData)
      {
        var data = getDataByInventoryFieldId(x);

        // we detect if it's a checkbox by checking if the value is an array
        if (data instanceof Array)
        {
          for (var i = data.length - 1; i >= 0; i--) {
            itemData[x][data[i]] = true;
          }
        }
        else
        {
          itemData[x] = data;
        }
      }

      $scope.loading = false;
    });
  }
  else
  {
    categoryPromise.then(function() {
      $scope.loading = false;
    });
  }

  $scope.openMapModal = function () {
    var mapModalInstance =  $modal.open({
      templateUrl: 'views/inventories/items/modalMap.html',
      windowClass: 'mapModal',
      resolve: {
        category: function() {
          var deferred = $q.defer();

          $scope.$watch('loading', function() {
            if ($scope.loading === false)
            {
              deferred.resolve($scope.category);
            }
          });

          return deferred.promise;
        }
      },
      controller: ['$scope', '$modalInstance', 'category', function($scope, $modalInstance, category) {
        $scope.updating = updating;
        $scope.category = category;

        $scope.latLng = [itemData[latLngIds[0]], itemData[latLngIds[1]]];

        $scope.close = function() {
          $modalInstance.close();
        };

        $scope.save = function() {
          itemData[latLngIds[0]] = $scope.latLng[0];
          itemData[latLngIds[1]] = $scope.latLng[1];

          $modalInstance.close();
        };
      }]
    });

    mapModalInstance.opened.then(function () {
      setTimeout(function() {
        $rootScope.selectLatLngMap.start();
      }, 80);
    });
  };

  $scope.send = function() {
    $scope.processingForm = true;
    var images = [], promises = [];

    // process images
    function addAsync(file) {
      var deferred = $q.defer();

      var picReader = new FileReader();

      picReader.addEventListener('load', function(event) {
        var picFile = event.target;

        images.push(picFile.result.replace(/^data:image\/[^;]+;base64,/, ''));
        deferred.resolve();
      });

      // pass as base64 and strip data:image
      picReader.readAsDataURL(file);

      return deferred.promise;
    }

    for (var i = uploader.queue.length - 1; i >= 0; i--) {
      promises.push(addAsync(uploader.queue[i].file));
    }

    $q.all(promises).then(function() {
      var formattedData = {inventory_status_id: $scope.item.inventory_status_id, data: {}}; // jshint ignore:line

      // we need to format our data
      for (var x in itemData)
      {
        if (itemData[x] !== null)
        {
          if (typeof itemData[x] === 'object')
          {
            var selectedItems = [];

            for (var z in itemData[x])
            {
              if (itemData[x][z] === true)
              {
                selectedItems.push(z);
              }
            }

            formattedData.data[x] = selectedItems;
          }
          else
          {
            formattedData.data[x] = itemData[x];
          }
        }
      }

      if ($scope.imagesFieldId !== null)
      {
        formattedData.data[$scope.imagesFieldId] = images;
      }

      if (updating)
      {
        var putCategoryPromise = Restangular.one('inventory').one('categories', categoryId).one('items', itemId).customPUT(formattedData);

        putCategoryPromise.then(function() {
          $scope.showMessage('ok', 'O item foi atualizado com sucesso!', 'success', true);

          $scope.processingForm = false;
        }, function(response) {
          $scope.showMessage('exclamation-sign', 'O item não pode ser criado. Por favor, revise os erros.', 'error', true);

          $scope.inputErrors = response.data.error;
          $scope.processingForm = false;
        });
      }
      else
      {
        var postCategoryPromise = Restangular.one('inventory').one('categories', categoryId).post('items', formattedData);

        postCategoryPromise.then(function() {
          $scope.showMessage('ok', 'O item foi criado com sucesso', 'success', true);

          $location.path('/inventories');
        }, function(response) {
          $scope.showMessage('exclamation-sign', 'O item não pode ser criado. Por favor, revise os erros.', 'error', true);

          $scope.inputErrors = response.data.error;
          $scope.processingForm = false;
        });
      }
    });
  };
});
