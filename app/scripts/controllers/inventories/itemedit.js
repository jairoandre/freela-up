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
  var locationFieldsIds = $scope.locationFieldsIds = [];

  $scope.item = {inventory_status_id: null}; // jshint ignore:line

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
              $scope.locationFieldsIds[0] = section.fields[j].id;
              $scope.hiddenFields.push(section.fields[j].id);
            }

            if (section.fields[j].title === 'longitude')
            {
              $scope.locationFieldsIds[1] = section.fields[j].id;
              $scope.hiddenFields.push(section.fields[j].id);
            }

            if (section.fields[j].title === 'address')
            {
              $scope.locationFieldsIds[2] = section.fields[j].id;
            }

            if (section.fields[j].title === 'postal_code')
            {
              $scope.locationFieldsIds[3] = section.fields[j].id;
            }

            if (section.fields[j].title === 'district')
            {
              $scope.locationFieldsIds[4] = section.fields[j].id;
            }

            if (section.fields[j].title === 'city')
            {
              $scope.locationFieldsIds[5] = section.fields[j].id;
            }

            if (section.fields[j].title === 'state')
            {
              $scope.locationFieldsIds[6] = section.fields[j].id;
            }
          }

          if (section.fields[j].kind === 'images')
          {
            itemData[section.fields[j].id] = $fileUploader.create({
              scope: $scope,
              fieldId: section.fields[j].id
            });

            // Images only
            var uploader = itemData[section.fields[j].id];

            uploader.filters.push(function(item /*{File|HTMLInputElement}*/) {
              var type = uploader.isHTML5 ? item.type : '/' + item.value.slice(item.value.lastIndexOf('.') + 1);
              type = '|' + type.toLowerCase().slice(type.lastIndexOf('/') + 1) + '|';
              return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            });

            // only accept files from the the uploader that the image was selected in
            uploader.bind('afteraddingfile', function(event, item) {
              if (item.fieldId !== item.uploader.fieldId)
              {
                this.removeFromQueue(item);
              }

              return;
            });
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

      var getFieldById = function(id) {
        for (var i = $scope.item.data.length - 1; i >= 0; i--) {

          if ($scope.item.data[i].field.id == id) // jshint ignore:line
          {
            return $scope.item.data[i];
          }
        }
      };

      // populate itemData with item information
      for (var x in itemData)
      {
        var data = getFieldById(x);

        if (typeof data !== 'undefined')
        {
          // we detect if it's a checkbox by checking if the value is an array
          if (data.field.kind === 'checkbox' && data.content !== null)
          {
            for (var i = data.content.length - 1; i >= 0; i--) {
              itemData[x][data.content[i]] = true;
            }
          }
          else if (data.field.kind === 'images' && data.content !== null)
          {
            itemData[x].existingImages = data.content;
          }
          else
          {
            itemData[x] = data.content;
          }
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

        $scope.latLng = [itemData[locationFieldsIds[0]], itemData[locationFieldsIds[1]]];

        $scope.close = function() {
          $modalInstance.close();
        };

        $scope.save = function() {

          var address, number, neighborhood, city, state, zipcode;

          itemData[locationFieldsIds[0]] = $scope.latLng[0];
          itemData[locationFieldsIds[1]] = $scope.latLng[1];
          itemData[locationFieldsIds[2]] = null;
          itemData[locationFieldsIds[3]] = null;
          itemData[locationFieldsIds[4]] = null;
          itemData[locationFieldsIds[5]] = null;
          itemData[locationFieldsIds[6]] = null;

          for (var i = $scope.addressComponents.length - 1; i >= 0; i--) {
            // complete address
            if ($scope.addressComponents[i].types[0] === 'route')
            {
              if (itemData[locationFieldsIds[2]] !== null)
              {
                itemData[locationFieldsIds[2]] = $scope.addressComponents[i].long_name + ', ' + itemData[locationFieldsIds[2]];
              }
              else
              {
                itemData[locationFieldsIds[2]] = $scope.addressComponents[i].long_name;
              }
            }

            // street number
            if ($scope.addressComponents[i].types[0] === 'street_number')
            {
              if (itemData[locationFieldsIds[2]] !== null)
              {
                itemData[locationFieldsIds[2]] = itemData[locationFieldsIds[2]] + ', ' + $scope.addressComponents[i].long_name;
              }
              else
              {
                itemData[locationFieldsIds[2]] = $scope.addressComponents[i].long_name;
              }
            }

            // neighborhood
            if ($scope.addressComponents[i].types[0] === 'neighborhood')
            {
              itemData[locationFieldsIds[4]] = $scope.addressComponents[i].long_name;
            }

            // city
            if ($scope.addressComponents[i].types[0] === 'locality')
            {
              itemData[locationFieldsIds[5]] = $scope.addressComponents[i].long_name;
            }

            // state
            if ($scope.addressComponents[i].types[0] === 'administrative_area_level_1')
            {
              itemData[locationFieldsIds[6]] = $scope.addressComponents[i].long_name;
            }

            // zip code
            if ($scope.addressComponents[i].types[0] === 'postal_code' || $scope.addressComponents[i].types[0] ===  'postal_code_prefix')
            {
              itemData[locationFieldsIds[3]] = $scope.addressComponents[i].long_name;
            }
          };

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
    var imagesFieldsPromises = [];

    var formattedData = {inventory_status_id: $scope.item.inventory_status_id, data: {}}; // jshint ignore:line

    // process images
    function addAsyncImage(img) {
      var deferred = $q.defer();

      var picReader = new FileReader();

      picReader.addEventListener('load', function(event) {
        var picFile = event.target;

        deferred.resolve(picFile.result.replace(/^data:image\/[^;]+;base64,/, ''));
      });

      // pass as base64 and strip data:image
      picReader.readAsDataURL(img);

      return deferred.promise;
    }

    var addAsyncImagesField = function(item, id) {
      var deferred = $q.defer();

      var imagesPromises = [];

      for (var i = item.queue.length - 1; i >= 0; i--) {
        imagesPromises.push(addAsyncImage(item.queue[i].file));
      }

      $q.all(imagesPromises).then(function(images) {
        var imagesObj = [];

        for (var i = images.length - 1; i >= 0; i--) {
          imagesObj.push({'content': images[i]});
        };

        formattedData.data[id] = imagesObj;

        // we processed all the images for this field! :-D
        deferred.resolve();
      });

      return deferred.promise;
    }

    // we need to format our data
    for (var x in itemData)
    {
      if (itemData[x] !== null)
      {
        if (typeof itemData[x] === 'object')
        {
          if (typeof itemData[x].queue !== 'undefined')
          {
            imagesFieldsPromises.push(addAsyncImagesField(itemData[x], x));
          }
          else
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
        }
        else
        {
          formattedData.data[x] = itemData[x];
        }
      }
    }

    $q.all(imagesFieldsPromises).then(function() {
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

        postCategoryPromise.then(function(response) {
          $scope.showMessage('ok', 'O item foi criado com sucesso', 'success', true);

          $location.path('/inventories/categories/' + response.data.inventory_category_id + '/item/' + response.data.id);
        }, function(response) {
          $scope.showMessage('exclamation-sign', 'O item não pode ser criado. Por favor, revise os erros.', 'error', true);

          $scope.inputErrors = response.data.error;
          $scope.processingForm = false;
        });
      }
    });
  };
});
