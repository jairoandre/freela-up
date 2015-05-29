'use strict';

angular
  .module('MapShowReportComponentModule', [])

  .directive('mapShowReport', function ($timeout, $q, $rootScope, $compile) {
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

          infoWindow: new google.maps.InfoWindow(),

          map: null,
          marker: null,

          start: function() {
            var styledMap = new google.maps.StyledMapType(this.options.styles, { name: 'zup' });

            this.map = new google.maps.Map(element[0], this.options.map);

            this.map.mapTypes.set('zup', styledMap);
            this.map.setMapTypeId('zup');

            scope.$watch('loading', function () {
              if (typeof scope.report !== 'undefined')
              {
                setTimeout(function() {
                  google.maps.event.trigger(mapProvider.map, 'resize');
                  google.maps.event.trigger(mapProvider.map, 'bounds_changed');
                  mapProvider.map.setCenter(mapProvider.options.homeLatlng);

                  if(!_.isNull(mapProvider.marker)) {
                    mapProvider.marker.setMap(null);
                  }

                  mapProvider.marker = mapProvider.addMarker(scope.report, scope.report.category);
                }, 80);
              }
            });

            scope.$watchCollection('[lat, lng]', function(){
              mapProvider.moveMarker(scope.lat, scope.lng);
            });
          },

          moveMarker: function(lat, lng){
            if(mapProvider.marker) {
              var latLng = new google.maps.LatLng(lat, lng);
              mapProvider.map.setCenter(latLng);
              mapProvider.marker.setPosition(latLng);
            }
          },

          addMarker: function(report, category) {
            var LatLng = new google.maps.LatLng(report.position.latitude, report.position.longitude);

            var infowindow = mapProvider.infoWindow;

            var iconSize = new google.maps.Size(54, 51);

            var categoryIcon = new google.maps.MarkerImage(category.marker.retina.web, null, null, null, iconSize);

            var pinOptions = {
              position: LatLng,
              map: this.map,
              icon: categoryIcon,
              category: category,
              report: report
            };

            var pin = new google.maps.Marker(pinOptions);

            this.map.setCenter(LatLng);

            google.maps.event.addListener(pin, 'click', function() {
              var html = '<div class="pinTooltip"><h1>{{category.title}}</h1><p>Enviada {{ report.created_at | date: \'dd/MM/yy HH:mm\'}}</p></div>';

              var newScope = scope.$new(true);

              newScope.category = this.category;
              newScope.report = this.report;

              var compiled = $compile(html)(newScope);

              newScope.$apply();

              infowindow.setContent(compiled[0]);
              infowindow.open(mapProvider.map, this);
            });

            return pin;
          }
        };

        mapProvider.start();

      }
    };
  });
