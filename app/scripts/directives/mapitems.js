'use strict';

angular.module('zupPainelApp')
  .directive('mapItems', function ($timeout, $q, $rootScope, Inventories, $compile) {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {
        var mapProvider = {
          options:
          {
            styles: [{}, {'featureType': 'poi.business', 'elementType': 'labels', 'stylers': [{ 'visibility': 'off' }] },{ 'featureType': 'poi.government', 'elementType': 'labels', 'stylers': [{ 'visibility': 'off' }] }, { 'featureType': 'poi.medical', 'elementType': 'labels', 'stylers': [{ 'visibility': 'off' }] }, { 'featureType': 'poi.place_of_worship', 'elementType': 'labels', 'stylers': [{ 'visibility': 'off' }] }, { 'featureType': 'poi.school', 'elementType': 'labels', 'stylers': [{ 'visibility': 'off' }] }, { 'featureType': 'poi.sports_complex', 'elementType': 'labels', 'stylers': [{ 'visibility': 'off' }] }, { 'featureType': 'transit', 'elementType': 'labels', 'stylers': [{ 'visibility': 'off' }, { 'saturation': -100 }, { 'lightness': 42 }] }, { 'featureType': 'road.highway', 'elementType': 'geometry.fill', 'stylers': [{ 'saturation': -100 }, { 'lightness': 47 }] }, { 'featureType': 'landscape', 'stylers': [{ 'lightness': 82 }, { 'saturation': -100 }] }, { 'featureType': 'water', 'stylers': [{ 'hue': '#00b2ff' }, { 'saturation': -21 }, { 'lightness': -4 }] }, { 'featureType': 'poi', 'stylers': [{ 'lightness': 19 }, { 'weight': 0.1 }, { 'saturation': -22 }] }, { 'elementType': 'geometry.fill', 'stylers': [{ 'visibility': 'on' }, { 'lightness': 18 }] }, { 'elementType': 'labels.text', 'stylers': [{ 'saturation': -100 }, { 'lightness': 28 }] }, { 'featureType': 'poi.attraction', 'elementType': 'labels', 'stylers': [{ 'visibility': 'off' }] }, { 'featureType': 'poi.park', 'elementType': 'geometry.fill', 'stylers': [{ 'saturation': 12 }, { 'lightness': 25 }] }, { 'featureType': 'road', 'elementType': 'labels.icon', 'stylers': [{ 'visibility': 'off' }] }, { 'featureType': 'road', 'elementType': 'labels.text', 'stylers': [{ 'lightness': 30 }] }, { 'featureType': 'landscape.man_made', 'elementType': 'labels', 'stylers': [{ 'visibility': 'off' }] }, { 'featureType': 'road.highway', 'elementType': 'geometry', 'stylers': [{ 'saturation': -100 }, { 'lightness': 56 }] }, { 'featureType': 'road.local', 'elementType': 'geometry.fill', 'stylers': [{ 'lightness': 62 }] }, { 'featureType': 'landscape.man_made', 'elementType': 'geometry', 'stylers': [{ 'visibility': 'off' }] }],
            homeLatlng: new google.maps.LatLng(-23.549671, -46.6321713),
            map: {
              zoom: 11,
              scrollwheel: false,
              mapTypeControl: false,
              mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'zup']
              }
            }
          },

          zoomLevels: {},
          currentZoom: 11,
          map: null,
          getNewItemsTimeout: null,
          hideNotVisibleMarkersTimeout: null,
          doAnimation: true,
          activeMethod: 'reports', // or items
          activeInventoryFilters: [],
          hiddenReportsCategories: [],
          hiddenInventoryCategories: [],
          mainMarker: null,
          allows_arbitrary_position: true,
          infoWindow: new google.maps.InfoWindow(),

          start: function() {
            // create map and set specific listeners
            this.createMap();
            this.setListeners();
          },

          createMap: function() {
            this.zoomLevels = {};
            this.currentZoom = 11;

            var styledMap = new google.maps.StyledMapType(this.options.styles, { name: 'zup' });

            this.map = new google.maps.Map(element[0], this.options.map);

            this.map.mapTypes.set('zup', styledMap);
            this.map.setMapTypeId('zup');
            this.map.setCenter(this.options.homeLatlng);
          },

          setListeners: function() {
            // refresh map when shown
            scope.$watch('categoryData', function () {
              mapProvider.createMap();

              setTimeout(function() {
                google.maps.event.trigger(mapProvider.map, 'resize');
                google.maps.event.trigger(mapProvider.map, 'bounds_changed');
                mapProvider.map.setCenter(mapProvider.options.homeLatlng);

                // Set listener for when bounds changes
                google.maps.event.addListener(mapProvider.map, 'bounds_changed', function() {
                  mapProvider.boundsChanged();
                });

                google.maps.event.trigger(mapProvider.map, 'bounds_changed');
              }, 80);
            });
          },

          getItems: function(options, precallback) {
            var params = {
              'position[latitude]': options.center.lat(),
              'position[longitude]': options.center.lng(),
              'position[distance]': options.distance,
              'limit': 80,
              'zoom': mapProvider.map.getZoom()
            };

            var itemsData = Inventories.getItems(params);

            return itemsData;
          },

          boundsChanged: function() {
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
            };

            this.hideNotVisibleMarkersTimeout = $timeout(function() {
              mapProvider.hideNotVisibleMarkers();
            }, 200);

            // Wait a bit until get new items
            if (this.getNewItemsTimeout)
            {
              $timeout.cancel(this.getNewItemsTimeout);
            };

            $rootScope.isLoadingItems = true;

            this.getNewItemsTimeout = $timeout(function() {
              var items = mapProvider.getItems({
                center: mapProvider.map.getCenter(),
                distance: mapProvider.getDistance(),
                limit: 100
              });

              $q.all([items.$promise]).then(function(values) {
                $rootScope.isLoadingItems = false;

                if (clearLevels)
                {
                  mapProvider.hideAllMarkersFromInactiveLevels();
                }

                // add reports
                for (var i = values[0].items.length - 1; i >= 0; i--) {
                  mapProvider.addMarker(values[0].items[i], mapProvider.doAnimation, 'item');
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
            angular.forEach(this.zoomLevels[this.map.getZoom()], function(marker, id) {
              if (!mapProvider.isMarkerInsideBounds(marker))
              {
                marker.setVisible(false);
              }
              else
              {
                var cat, pos;

                if (marker.type === 'report')
                {
                  pos = mapProvider.hiddenReportsCategories.indexOf(marker.item.category_id);
                }

                if (marker.type === 'item')
                {
                  pos = mapProvider.hiddenInventoryCategories.indexOf(marker.item.inventory_category_id);
                }

                if (!~pos)
                {
                  marker.setVisible(true);
                }
              }
            });
          },

          hideAllMarkersFromInactiveLevels: function() {
            angular.forEach(this.zoomLevels, function(zoomLevel, zoomLevelId) {
              console.log(zoomLevelId, mapProvider.currentZoom);
              if (zoomLevelId != mapProvider.currentZoom)
              {
                angular.forEach(zoomLevel, function(marker, id) {
                  marker.setVisible(false);
                });
              }
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

              var category = scope.getInventoryCategory(item.inventory_category_id);
              var iconSize = new google.maps.Size(15, 15);
              var itemType = 'item';

              var pos = mapProvider.hiddenInventoryCategories.indexOf(item.inventory_category_id);

              var categoryIcon = new google.maps.MarkerImage(category.pin.retina.web, null, null, null, iconSize);

              var pinOptions = {
                position: LatLng,
                map: this.map,
                icon: categoryIcon,
                category: category,
                item: item,
                type: itemType
              };

              if (typeof effect !== 'undefined' && effect === true)
              {
                pinOptions.animation = google.maps.Animation.DROP;
              }

              var pin = new google.maps.Marker(pinOptions);

              this.zoomLevels[this.map.getZoom()][type + '_' + item.id] = pin;

              google.maps.event.addListener(pin, 'click', function() {
                var html = '<div class="pinTooltip"><h1>{{category.title}}</h1><p>Enviada {{ item.created_at | date: \'dd/MM/yy HH:mm\'}}</p><a href="#/inventories/{{ category.id }}/item/{{ item.id }}">Ver detalhes</a></div>';

                var new_scope = scope.$new(true);

                new_scope.category = this.category;
                new_scope.item = this.item;

                var compiled = $compile(html)(new_scope);

                new_scope.$apply();

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

        scope.mapProvider = mapProvider;

      }
    };
  });

