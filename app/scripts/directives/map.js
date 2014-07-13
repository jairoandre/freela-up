'use strict';

angular.module('zupPainelApp')
  .directive('map', function ($compile, $timeout) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var mapProvider = {
          options:
          {
            styles: [{}, {'featureType': 'poi.business', 'elementType': 'labels', 'stylers': [{ 'visibility': 'off' }] },{ 'featureType': 'poi.government', 'elementType': 'labels', 'stylers': [{ 'visibility': 'off' }] }, { 'featureType': 'poi.medical', 'elementType': 'labels', 'stylers': [{ 'visibility': 'off' }] }, { 'featureType': 'poi.place_of_worship', 'elementType': 'labels', 'stylers': [{ 'visibility': 'off' }] }, { 'featureType': 'poi.school', 'elementType': 'labels', 'stylers': [{ 'visibility': 'off' }] }, { 'featureType': 'poi.sports_complex', 'elementType': 'labels', 'stylers': [{ 'visibility': 'off' }] }, { 'featureType': 'transit', 'elementType': 'labels', 'stylers': [{ 'visibility': 'off' }, { 'saturation': -100 }, { 'lightness': 42 }] }, { 'featureType': 'road.highway', 'elementType': 'geometry.fill', 'stylers': [{ 'saturation': -100 }, { 'lightness': 47 }] }, { 'featureType': 'landscape', 'stylers': [{ 'lightness': 82 }, { 'saturation': -100 }] }, { 'featureType': 'water', 'stylers': [{ 'hue': '#00b2ff' }, { 'saturation': -21 }, { 'lightness': -4 }] }, { 'featureType': 'poi', 'stylers': [{ 'lightness': 19 }, { 'weight': 0.1 }, { 'saturation': -22 }] }, { 'elementType': 'geometry.fill', 'stylers': [{ 'visibility': 'on' }, { 'lightness': 18 }] }, { 'elementType': 'labels.text', 'stylers': [{ 'saturation': -100 }, { 'lightness': 28 }] }, { 'featureType': 'poi.attraction', 'elementType': 'labels', 'stylers': [{ 'visibility': 'off' }] }, { 'featureType': 'poi.park', 'elementType': 'geometry.fill', 'stylers': [{ 'saturation': 12 }, { 'lightness': 25 }] }, { 'featureType': 'road', 'elementType': 'labels.icon', 'stylers': [{ 'visibility': 'off' }] }, { 'featureType': 'road', 'elementType': 'labels.text', 'stylers': [{ 'lightness': 30 }] }, { 'featureType': 'landscape.man_made', 'elementType': 'labels', 'stylers': [{ 'visibility': 'off' }] }, { 'featureType': 'road.highway', 'elementType': 'geometry', 'stylers': [{ 'saturation': -100 }, { 'lightness': 56 }] }, { 'featureType': 'road.local', 'elementType': 'geometry.fill', 'stylers': [{ 'lightness': 62 }] }, { 'featureType': 'landscape.man_made', 'elementType': 'geometry', 'stylers': [{ 'visibility': 'off' }] }],
            homeLatlng: new google.maps.LatLng(-23.549671, -46.6321713),
            map: {
              zoom: 15,
              mapTypeControl: false,
              panControl: true,
              panControlOptions: {
                position: google.maps.ControlPosition.TOP_RIGHT
              },
              zoomControl: true,
              zoomControlOptions: {
                position: google.maps.ControlPosition.TOP_RIGHT
              },
              scaleControl: true,
              scaleControlOptions: {
                position: google.maps.ControlPosition.TOP_RIGHT
              },
              streetViewControl: true,
              streetViewControlOptions: {
                position: google.maps.ControlPosition.TOP_RIGHT
              }
            }
          },

          zoomLevels: {},
          currentZoom: 15,
          map: null,
          getNewItemsTimeout: null,
          hideNotVisibleMarkersTimeout: null,
          doAnimation: true,
          activeMethod: 'reports', // or items
          activeInventoryFilters: [],
          hiddenReportsCategories: [],
          hiddenInventoryCategories: [],
          infoWindow: new google.maps.InfoWindow(),
          currentReportFilterStatus: null,

          start: function() {
            // create map and set specific listeners
            this.createMap();
            this.setListeners();
          },

          createMap: function() {
            var styledMap = new google.maps.StyledMapType(this.options.styles, { name: 'zup' });

            this.map = new google.maps.Map(element[0], this.options.map);

            this.map.mapTypes.set('zup', styledMap);
            this.map.setMapTypeId('zup');
            this.map.setCenter(this.options.homeLatlng);

            setTimeout(function() {
              google.maps.event.trigger(mapProvider.map, 'resize');
              google.maps.event.trigger(mapProvider.map, 'bounds_changed');
              mapProvider.map.setCenter(mapProvider.options.homeLatlng);
            }, 80);
          },

          setListeners: function() {
            // Set listener for when bounds changes
            google.maps.event.addListener(this.map, 'bounds_changed', function() {
              mapProvider.boundsChanged();
            });

            scope.$on('updateMap', function() {
              mapProvider.boundsChanged(true);
            });
          },

          boundsChanged: function(forceReset) {
            var clearLevels = false;

            if (typeof this.zoomLevels[this.map.getZoom()] === 'undefined')
            {
              this.zoomLevels[this.map.getZoom()] = {};
            }

            // Check if zoom has changed
            if (this.currentZoom !== this.map.getZoom())
            {
              clearLevels = true;

              this.currentZoom = this.map.getZoom();
            }

            // Wait a bit until hide/show items
            if (this.hideNotVisibleMarkersTimeout)
            {
              $timeout.cancel(this.hideNotVisibleMarkersTimeout);
            }

            this.hideNotVisibleMarkersTimeout = $timeout(function() {
              mapProvider.hideNotVisibleMarkers();
            }, 200);

            // Wait a bit until get new items
            if (this.getNewItemsTimeout)
            {
              $timeout.cancel(this.getNewItemsTimeout);
            }

            scope.isLoadingItems = true;

            this.getNewItemsTimeout = $timeout(function() {
              var items = scope.getData(false, {
                position: {'latitude': mapProvider.map.getCenter().lat(), 'longitude': mapProvider.map.getCenter().lng(), 'distance': mapProvider.getDistance()},
                zoom: mapProvider.map.getZoom(),
                limit: 100
              });

              items.then(function(response) {
                scope.isLoadingItems = false;

                if (forceReset === true)
                {
                  mapProvider.removeAllMarkers();
                }

                if (clearLevels)
                {
                  mapProvider.hideAllMarkersFromInactiveLevels();
                }

                // add item
                for (var i = response.data.length - 1; i >= 0; i--) {
                  mapProvider.addMarker(response.data[i], mapProvider.doAnimation);
                }

                // after first request we will deactive animation
                if (mapProvider.doAnimation === true)
                {
                  mapProvider.doAnimation = false;
                }
              });

            }, 1000);
          },

          // Hide every marker that is not visible to the user
          hideNotVisibleMarkers: function() {
            angular.forEach(this.zoomLevels[this.map.getZoom()], function(marker) {
              if (!mapProvider.isMarkerInsideBounds(marker))
              {
                marker.setVisible(false);
              }
              else
              {
                var pos;

                if (attrs.mapCategory === 'report')
                {
                  pos = mapProvider.hiddenReportsCategories.indexOf(marker.item.category_id); // jshint ignore:line
                }

                if (attrs.mapCategory === 'inventory')
                {
                  pos = mapProvider.hiddenInventoryCategories.indexOf(marker.item.inventory_category_id); // jshint ignore:line
                }

                if (!~pos) // jshint ignore:line
                {
                  marker.setVisible(true);
                }
              }
            });
          },

          hideAllMarkersFromInactiveLevels: function() {
            angular.forEach(this.zoomLevels, function(zoomLevel, zoomLevelId) {
              if (zoomLevelId !== mapProvider.currentZoom)
              {
                angular.forEach(zoomLevel, function(marker) {
                  marker.setVisible(false);
                });
              }
            });
          },

          removeAllMarkers: function() {
            angular.forEach(this.zoomLevels, function(zoomLevel, zoomLevelId) {
              angular.forEach(zoomLevel, function(marker, id) {
                marker.setMap(null);

                delete mapProvider.zoomLevels[zoomLevelId][id];
              });
            });
          },

          isMarkerInsideBounds: function(marker) {
            return this.map.getBounds().contains(marker.getPosition());
          },

          addMarker: function(item, effect, type) {
            if (typeof this.zoomLevels[this.map.getZoom()][type + '_' + item.id] === 'undefined')
            {
              var LatLng = new google.maps.LatLng(item.position.latitude, item.position.longitude);

              var infowindow = mapProvider.infoWindow;

              var category, iconSize, iconImg, viewAction, visibility = false;

              if (attrs.mapCategory === 'report')
              {
                category = scope.getReportCategory(item.category_id); // jshint ignore:line
                iconSize = new google.maps.Size(54, 51);
                iconImg = category.marker.retina.web;

                var pos = mapProvider.hiddenReportsCategories.indexOf(item.category_id); // jshint ignore:line

                if (!~pos) // jshint ignore:line
                {
                  visibility = true;
                }
              }
              else
              {
                category = scope.getInventoryCategory(item.inventory_category_id); // jshint ignore:line
                iconSize = new google.maps.Size(15, 15);
                iconImg = category.pin.retina.web;
                //iconSize = new google.maps.Size(54, 51);

                var pos = mapProvider.hiddenInventoryCategories.indexOf(item.inventory_category_id); // jshint ignore:line

                if (!~pos) // jshint ignore:line
                {
                  visibility = true;
                }
              }

              var categoryIcon = new google.maps.MarkerImage(iconImg, null, null, null, iconSize);

              var pinOptions = {
                position: LatLng,
                map: this.map,
                icon: categoryIcon,
                category: category,
                item: item,
              };

              if (typeof effect !== 'undefined' && effect === true)
              {
                pinOptions.animation = google.maps.Animation.DROP;
              }

              var pin = new google.maps.Marker(pinOptions);

              if (!visibility)
              {
                pin.setVisible(false);
              }

              this.zoomLevels[this.map.getZoom()][type + '_' + item.id] = pin;

              google.maps.event.addListener(pin, 'click', function() {
                var html;

                if (attrs.mapCategory === 'report')
                {
                  html = '<div class="pinTooltip"><h1>{{category.title}}</h1><p>Enviada {{ item.created_at | date: \'dd/MM/yy HH:mm\'}}</p><a href="#/reports/categories/{{ category.id }}/item/{{ item.id }}">Ver detalhes</a></div>';
                }
                else
                {
                  html = '<div class="pinTooltip"><h1>{{category.title}}</h1><p>Enviada {{ item.created_at | date: \'dd/MM/yy HH:mm\'}}</p><a href="#/inventories/categories/{{ category.id }}/item/{{ item.id }}">Ver detalhes</a></div>';
                }

                var newScope = scope.$new(true);

                newScope.category = this.category;
                newScope.item = this.item;
                newScope.view = viewAction;

                var compiled = $compile(html)(newScope);

                newScope.$apply();

                infowindow.setContent(compiled[0]);
                infowindow.open(mapProvider.map, this);
              });
            }
          },

          getDistance: function() {
            var bounds = this.map.getBounds();

            var center = bounds.getCenter();
            var ne = bounds.getNorthEast();

            var dis = google.maps.geometry.spherical.computeDistanceBetween(center, ne);

            return dis;
          }
        };

        mapProvider.start();

        // bind to scope
        scope.map = mapProvider.map;
      }
    };
  });
