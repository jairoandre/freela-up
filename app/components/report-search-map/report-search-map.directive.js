/* global google */
'use strict';

angular
  .module('ReportSearchMapComponentModule', [])

  .directive('reportSearchMap', function ($timeout) {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {
        scope.$watch('mapProvider', function() {
          if (typeof scope.mapProvider !== 'undefined')
          {
            google.maps.event.clearListeners(scope.mapProvider.map);

            var options = {
              types: ['geocode'],
              componentRestrictions: { country: 'br' }
            };

            var autocomplete = new google.maps.places.Autocomplete(element[0], options);
            autocomplete.bindTo('bounds', scope.mapProvider.map);

            var callback = function(predictions, status) {
              if (status != google.maps.places.PlacesServiceStatus.OK) {
                $timeout(function() {
                  scope.showLoadingForAutocompleteRequest = false;
                });

                return;
              }
            };

            scope.showLoading = function() {
              scope.showLoadingForAutocompleteRequest = true;

              var service = new google.maps.places.AutocompleteService();

              service.getQueryPredictions({ input: element[0] }, callback);
            };

            google.maps.event.addListener(autocomplete, 'place_changed', function() {
              var place = autocomplete.getPlace();

              console.log(place);

              if (!place.geometry) {
                return;
              }

              if (place.geometry.viewport) {
                scope.mapProvider.map.fitBounds(place.geometry.viewport);
              } else {
                scope.mapProvider.map.setCenter(place.geometry.location);
                scope.mapProvider.map.setZoom(17);
              }

              if (scope.mapProvider.allows_arbitrary_position == true)
              {
                scope.mapProvider.mainMarker.setPosition(place.geometry.location);
                scope.mapProvider.changedMarkerPosition(place.geometry.location.lat(), place.geometry.location.lng(), undefined, true);
              }
              else
              {
                var marker = new google.maps.Marker({
                  map: scope.mapProvider.map,
                  position: place.geometry.location
                });

                marker.setIcon(({
                  url: place.icon,
                  size: new google.maps.Size(71, 71),
                  origin: new google.maps.Point(0, 0),
                  anchor: new google.maps.Point(17, 34),
                  scaledSize: new google.maps.Size(35, 35),
                }));
              }
            });
          }
        });
      }
    };
  });
