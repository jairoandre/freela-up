'use strict';

angular
  .module('MapComponentModule', [])
  .directive('map', function ($compile, $timeout, ENV) {
    return {
      restrict: 'A',
      scope: {
        getCategory: '&',
        getData: '&'
      },
      link: function postLink(scope, element, attrs) {

        var isMapWithReports = attrs.mapCategory === 'reports' ? true : false,
            currentMarkers = {},
            zoomLevel = parseInt(ENV.mapZoom),
            homeLatlng = new google.maps.LatLng(ENV.mapLat, ENV.mapLng),
            infoWindow = new google.maps.InfoWindow();

        var options = {styles:[{},{featureType:"poi.business",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"poi.government",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"poi.medical",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"poi.place_of_worship",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"poi.school",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"poi.sports_complex",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"transit",elementType:"labels",stylers:[{visibility:"off"},{saturation:-100},{lightness:42}]},{featureType:"road.highway",elementType:"geometry.fill",stylers:[{saturation:-100},{lightness:47}]},{featureType:"landscape",stylers:[{lightness:82},{saturation:-100}]},{featureType:"water",stylers:[{hue:"#00b2ff"},{saturation:-21},{lightness:-4}]},{featureType:"poi",stylers:[{lightness:19},{weight:.1},{saturation:-22}]},{elementType:"geometry.fill",stylers:[{visibility:"on"},{lightness:18}]},{elementType:"labels.text",stylers:[{saturation:-100},{lightness:28}]},{featureType:"poi.attraction",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"poi.park",elementType:"geometry.fill",stylers:[{saturation:12},{lightness:25}]},{featureType:"road",elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"road",elementType:"labels.text",stylers:[{lightness:30}]},{featureType:"landscape.man_made",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"road.highway",elementType:"geometry",stylers:[{saturation:-100},{lightness:56}]},{featureType:"road.local",elementType:"geometry.fill",stylers:[{lightness:62}]},{featureType:"landscape.man_made",elementType:"geometry",stylers:[{visibility:"off"}]}],homeLatlng: homeLatlng,map:{zoom:zoomLevel,mapTypeControl:!1,panControl:!0,panControlOptions:{position:google.maps.ControlPosition.TOP_RIGHT},zoomControl:!0,zoomControlOptions:{position:google.maps.ControlPosition.TOP_RIGHT},scaleControl:!0,scaleControlOptions:{position:google.maps.ControlPosition.TOP_RIGHT},streetViewControl:!0,streetViewControlOptions:{position:google.maps.ControlPosition.TOP_RIGHT}}};

        var styledMap = new google.maps.StyledMapType(options.styles, { name: 'zup' });

        var map = new google.maps.Map(element[0], options.map);

        map.mapTypes.set('zup', styledMap);
        map.setMapTypeId('zup');
        map.setCenter(options.homeLatlng);

        var getDistance = function() {
          var bounds = map.getBounds();

          var center = bounds.getCenter();
          var ne = bounds.getNorthEast();

          var dis = google.maps.geometry.spherical.computeDistanceBetween(center, ne);

          return dis;
        };

        var createIcon = function(position, markerImage, color, count, extraData) {

          var extraClass = markerImage.isPin ? 'pin' : '';

          var html = '<div class="marker ' + extraClass + '" style="background-image: url(' + markerImage.url + ')">';

          if (count)
          {
            html += '<span style="background-color: ' + color + ';">' + count + '</span>';
          }

          html += '</div>';

          var marker = new RichMarker({
            position: position,
            map: map,
            draggable: false,
            shadow: false,
            content: html,
            extraData: extraData
          });

          return marker;
        };

        var itemsIds = [], clusters = [];

        var addItemsToMap = function(data) {
          var category, categoryId, items = isMapWithReports ? data.reports : data.items;

          for (var i = items.length - 1; i >= 0; i--) {
            categoryId = isMapWithReports ? items[i].category_id : items[i].inventory_category_id;
            category = scope.getCategory({ id: categoryId });

            if (category && itemsIds.indexOf(items[i].id) === -1)
            {
              var markerImage = { url: category.marker.retina.web, isPin: false };

              if (!isMapWithReports && category.plot_format === 'pin')
              {
                markerImage.url = category.pin.retina.web;
                markerImage.isPin = true;
              }

              var marker = createIcon(new google.maps.LatLng(items[i].position.latitude, items[i].position.longitude), markerImage, false, false, { category: category, item: items[i] });

              currentMarkers.push(marker);
              itemsIds.push(items[i].id);

              google.maps.event.addListener(marker, 'click', function() {
                var html;

                if (isMapWithReports)
                {
                  html = '<div class="pinTooltip"><h1>{{category.title}}</h1><p>Enviado em {{ item.created_at | date: \'dd/MM/yy HH:mm\'}}</p><a href="#/reports/{{ item.id }}">Ver detalhes</a></div>';
                }
                else
                {
                  html = '<div class="pinTooltip"><h1>{{ item.title }}</h1><p>Criado em {{ item.created_at | date: \'dd/MM/yy HH:mm\'}}</p><a href="#/items/{{ item.id }}">Ver detalhes</a></div>';
                }

                var newScope = scope.$new(true);

                newScope.category = this.extraData.category;
                newScope.item = this.extraData.item;

                var compiled = $compile(html)(newScope);

                newScope.$apply();

                infoWindow.setContent(compiled[0]);
                infoWindow.open(map, this);
              });
            }
          };

          for (var i = data.clusters.length - 1; i >= 0; i--) {
            // we generate an ID for the cluster -- FIXME this is horrible
            var cluster = data.clusters[i].position[0] + data.clusters[i].position[1] + data.clusters[i].count;

            if (clusters.indexOf(cluster) === -1)
            {
              var markerImage = { url: data.clusters[i].category.marker.retina.web, isPin: false };

              if (!isMapWithReports && category.plot_format === 'pin')
              {
                markerImage.url = data.clusters[i].category.pin.retina.web;
                markerImage.isPin = true;
              }

              var marker = createIcon(new google.maps.LatLng(data.clusters[i].position[0], data.clusters[i].position[1]), markerImage, data.clusters[i].category.color, data.clusters[i].count);

              currentMarkers.push(marker);
              clusters.push(cluster);
            }
          };
        };

        var resetMap = function() {
          for (var i = currentMarkers.length - 1; i >= 0; i--) {
            currentMarkers[i].setMap(null);
          };

          currentMarkers = [];
          itemsIds = [];
          clusters = [];
        };

        var isMarkerInsideBounds = function(marker) {
          return map.getBounds().contains(marker.getPosition());
        };

        var hideOutOfBoundsMarkers = function()
        {
          for (var i = currentMarkers.length - 1; i >= 0; i--) {
            if (isMarkerInsideBounds(currentMarkers[i]))
            {
              currentMarkers[i].setVisible(true);
            }
            else
            {
              currentMarkers[i].setVisible(false);
            }
          };
        };

        var movedMap = function() {
          var items = scope.getData(
            {
              paginate: false,
              options: {
                position: {'latitude': map.getCenter().lat(), 'longitude': map.getCenter().lng(), 'distance': getDistance()},
                zoom: map.getZoom(),
                clusterize: true,
                limit: 100
              }
          });

          if (typeof items !== 'undefined')
          {
            items.then(function(response) {
              addItemsToMap(response.data);
            });
          }
        };

        var prevZoomLevel = null;
        var timeout = null

        var boundsChanged = function() {
          var clearLevels = false;

          var currentZoom = map.getZoom();

          if (prevZoomLevel !== currentZoom)
          {
            resetMap();

            prevZoomLevel = currentZoom;
          }

          if (timeout)
          {
            clearTimeout(timeout);
          }

          timeout = setTimeout(function() {
            movedMap();
            hideOutOfBoundsMarkers();
          }, 500);
        };

        google.maps.event.addListener(map, 'bounds_changed', function() {
          boundsChanged();
        });

        scope.$on('updateMap', function() {
          resetMap();
          boundsChanged();
        });
      }
    }
  });
