'use strict';

angular
  .module('ItemsSelectAddressModalControllerModule', [
    'SelectLatLngMapComponent',
    'SearchLatLngMapComponent'
  ])

  .controller('ItemsSelectAddressModalController', function($scope, $modalInstance, category, updating, itemData, locationFieldsIds) {
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

      if ($scope.addressComponents)
      {
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
      }

      $modalInstance.close();
    };
  });
