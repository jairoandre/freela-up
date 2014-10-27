'use strict';

angular.module('zupPainelApp')
  .directive('selectLatLngMap', function ($rootScope) {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {
        var mapProvider = {
          options:
          {
            styles: [{}, {'featureType': 'poi.business', 'elementType': 'labels', 'stylers': [{ 'visibility': 'off' }] },{ 'featureType': 'poi.government', 'elementType': 'labels', 'stylers': [{ 'visibility': 'off' }] }, { 'featureType': 'poi.medical', 'elementType': 'labels', 'stylers': [{ 'visibility': 'off' }] }, { 'featureType': 'poi.place_of_worship', 'elementType': 'labels', 'stylers': [{ 'visibility': 'off' }] }, { 'featureType': 'poi.school', 'elementType': 'labels', 'stylers': [{ 'visibility': 'off' }] }, { 'featureType': 'poi.sports_complex', 'elementType': 'labels', 'stylers': [{ 'visibility': 'off' }] }, { 'featureType': 'transit', 'elementType': 'labels', 'stylers': [{ 'visibility': 'off' }, { 'saturation': -100 }, { 'lightness': 42 }] }, { 'featureType': 'road.highway', 'elementType': 'geometry.fill', 'stylers': [{ 'saturation': -100 }, { 'lightness': 47 }] }, { 'featureType': 'landscape', 'stylers': [{ 'lightness': 82 }, { 'saturation': -100 }] }, { 'featureType': 'water', 'stylers': [{ 'hue': '#00b2ff' }, { 'saturation': -21 }, { 'lightness': -4 }] }, { 'featureType': 'poi', 'stylers': [{ 'lightness': 19 }, { 'weight': 0.1 }, { 'saturation': -22 }] }, { 'elementType': 'geometry.fill', 'stylers': [{ 'visibility': 'on' }, { 'lightness': 18 }] }, { 'elementType': 'labels.text', 'stylers': [{ 'saturation': -100 }, { 'lightness': 28 }] }, { 'featureType': 'poi.attraction', 'elementType': 'labels', 'stylers': [{ 'visibility': 'off' }] }, { 'featureType': 'poi.park', 'elementType': 'geometry.fill', 'stylers': [{ 'saturation': 12 }, { 'lightness': 25 }] }, { 'featureType': 'road', 'elementType': 'labels.icon', 'stylers': [{ 'visibility': 'off' }] }, { 'featureType': 'road', 'elementType': 'labels.text', 'stylers': [{ 'lightness': 30 }] }, { 'featureType': 'landscape.man_made', 'elementType': 'labels', 'stylers': [{ 'visibility': 'off' }] }, { 'featureType': 'road.highway', 'elementType': 'geometry', 'stylers': [{ 'saturation': -100 }, { 'lightness': 56 }] }, { 'featureType': 'road.local', 'elementType': 'geometry.fill', 'stylers': [{ 'lightness': 62 }] }, { 'featureType': 'landscape.man_made', 'elementType': 'geometry', 'stylers': [{ 'visibility': 'off' }] }],
            homeLatlng: new google.maps.LatLng(-23.549671, -46.6321713),
            map: {
              zoom: 15,
              scrollwheel: false,
              mapTypeControl: false,
              mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'zup']
              }
            }
          },

          map: null,
          mainMarker: null,

          start: function() {
            var styledMap = new google.maps.StyledMapType(this.options.styles, { name: 'zup' });

            this.map = new google.maps.Map(element[0], this.options.map);

            this.map.mapTypes.set('zup', styledMap);
            this.map.setMapTypeId('zup');

            var position;

            console.log(scope.$parent.latLng[0], scope.$parent.latLng[1]);

            if (scope.$parent.latLng[0] === null && scope.$parent.latLng[1] === null)
            {
              position = mapProvider.options.homeLatlng;
            }
            else
            {
              position = new google.maps.LatLng(scope.$parent.latLng[0], scope.$parent.latLng[1]);
              mapProvider.changedMarkerPosition(scope.$parent.latLng[0], scope.$parent.latLng[1]);
            }

            var categoryIcon = new google.maps.MarkerImage(scope.$parent.category.marker.retina.web, null, null, null, new google.maps.Size(54, 51));

            var marker = new google.maps.Marker(
            {
              map: mapProvider.map,
              draggable: true,
              animation: google.maps.Animation.DROP,
              position: position,
              icon: categoryIcon
            });

            mapProvider.mainMarker = marker;

            mapProvider.map.setCenter(position);

            google.maps.event.addListener(marker, 'dragend', function() {
              mapProvider.changedMarkerPosition(mapProvider.mainMarker.getPosition().lat(), mapProvider.mainMarker.getPosition().lng());
            });
          },

          changedMarkerPosition: function(lat, lng, addressComponents) {
            var geocoder = new google.maps.Geocoder();

            scope.$parent.latLng = [lat, lng];

            scope.$parent.addressComponents = null;

            if (typeof addressComponents !== 'undefined')
            {
              scope.$parent.addressComponents = addressComponents;
            }

            geocoder.geocode({
              latLng: new google.maps.LatLng(lat, lng)
            },
            function(results, status)
            {
              if (status === google.maps.GeocoderStatus.OK)
              {
                if (typeof addressComponents === 'undefined')
                {
                  scope.$parent.addressComponents = results[0].address_components;
                  scope.formattedAddress = results[0].formatted_address; // jshint ignore:line
                }

                scope.$apply();
              }
            });
          },
        };

        mapProvider.start();

        $rootScope.selectLatLngMap = mapProvider;
      }
    };
  });
