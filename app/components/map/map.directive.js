'use strict';

angular
  .module('MapComponentModule', ['ReportsItemsServiceModule'])
  .directive('map', function ($rootScope, $compile, $timeout, ENV, ReportsItemsService) {
    return {
      restrict: 'A',
      scope: {
        getCategory: '&',
        getData: '&',
        getFiltersOptions: '&'
      },
      link: function postLink(scope, element, attrs) {

        $rootScope.uiDebugMap = true;

        var itemsAreReports = attrs.mapCategory === 'reports' ? true : false,
          currentMarkers = {},
          nextClusters = [],
          nextItems = [],
          zoomLevel = parseInt(ENV.mapZoom),
          homeLatlng = new google.maps.LatLng(ENV.mapLat, ENV.mapLng),
          infoWindow = new google.maps.InfoWindow();

        var options = {styles:[{},{featureType:"poi.business",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"poi.government",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"poi.medical",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"poi.place_of_worship",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"poi.school",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"poi.sports_complex",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"transit",elementType:"labels",stylers:[{visibility:"off"},{saturation:-100},{lightness:42}]},{featureType:"road.highway",elementType:"geometry.fill",stylers:[{saturation:-100},{lightness:47}]},{featureType:"landscape",stylers:[{lightness:82},{saturation:-100}]},{featureType:"water",stylers:[{hue:"#00b2ff"},{saturation:-21},{lightness:-4}]},{featureType:"poi",stylers:[{lightness:19},{weight:.1},{saturation:-22}]},{elementType:"geometry.fill",stylers:[{visibility:"on"},{lightness:18}]},{elementType:"labels.text",stylers:[{saturation:-100},{lightness:28}]},{featureType:"poi.attraction",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"poi.park",elementType:"geometry.fill",stylers:[{saturation:12},{lightness:25}]},{featureType:"road",elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"road",elementType:"labels.text",stylers:[{lightness:30}]},{featureType:"landscape.man_made",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"road.highway",elementType:"geometry",stylers:[{saturation:-100},{lightness:56}]},{featureType:"road.local",elementType:"geometry.fill",stylers:[{lightness:62}]},{featureType:"landscape.man_made",elementType:"geometry",stylers:[{visibility:"off"}]}],homeLatlng: homeLatlng,map:{zoom:zoomLevel,mapTypeControl:!1,panControl:!0,panControlOptions:{position:google.maps.ControlPosition.TOP_RIGHT},zoomControl:!0,zoomControlOptions:{position:google.maps.ControlPosition.TOP_RIGHT},scaleControl:!0,scaleControlOptions:{position:google.maps.ControlPosition.TOP_RIGHT},streetViewControl:!0,streetViewControlOptions:{position:google.maps.ControlPosition.TOP_RIGHT}}};

        var styledMap = new google.maps.StyledMapType(options.styles, { name: 'zup' });

        var map = new google.maps.Map(element[0], options.map);

        map.mapTypes.set('zup', styledMap);
        map.setMapTypeId('zup');
        map.setCenter(options.homeLatlng);

        var getDistance = function () {
          var bounds = map.getBounds();

          var center = bounds.getCenter();
          var ne = bounds.getNorthEast();

          return google.maps.geometry.spherical.computeDistanceBetween(center, ne);
        };

        var displayInfoWindow = function (event) {
          var html;

          if (itemsAreReports) {
            html = '<div class="pinTooltip"><h1>{{ item.category.title }}</h1><p>Enviado em {{ item.created_at | date: \'dd/MM/yy HH:mm\'}}</p><a href="#/reports/{{ item.id }}">Ver detalhes</a></div>';
          }
          else {
            html = '<div class="pinTooltip"><h1>{{ item.title }}</h1><p>Criado em {{ item.created_at | date: \'dd/MM/yy HH:mm\'}}</p><a href="#/items/{{ item.id }}">Ver detalhes</a></div>';
          }

          var newScope = scope.$new(true);

          newScope.category = this.extraData.category;
          newScope.item = this.extraData.item;

          var compiled = $compile(html)(newScope);

          newScope.$apply();

          infoWindow.setContent(compiled[0]);
          infoWindow.open(map, this);
        };

        var createMarker = function (position, markerImage, color, count, extraData) {

          var extraClass = markerImage.isPin ? 'pin' : '';

          var html = '<div class="marker ' + extraClass + '" style="background-image: url(' + markerImage.url + ')">';

          if (count) {
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

        var createItemMarker = function (item) {
          var markerImage = {};

          if (!itemsAreReports && category.plot_format === 'pin') {
            markerImage.url = category.pin.retina.web;
            markerImage.isPin = true;
          } else {
            markerImage.url = category.marker.retina.web;
            markerImage.isPin = false;
          }

          var position = new google.maps.LatLng(item.position.latitude, item.position.longitude);
          var marker = createMarker(position, markerImage, false, false, { category: category, item: items[i] });

          google.maps.event.addListener(marker, 'click', displayInfoWindow);

          return marker;
        };

        var createClusterMarker = function(cluster){
          var markerImage = { url: cluster.category.marker.retina.web, isPin: false };

          if (!itemsAreReports && category.plot_format === 'pin') {
            markerImage.url = data.cluster.category.pin.retina.web;
            markerImage.isPin = true;
          }

          var position = new google.maps.LatLng(cluster.position[0], cluster.position[1]);
          return createMarker(position, markerImage, cluster.category.color, cluster.count);
        };

        var refreshMap = function () {
          var nextMarkers = {};

          _.each(nextClusters, function(cluster){
            var clusterID = (cluster.position[0]).toString() + cluster.position[1] + cluster.count + cluster.category_id;
            if(!currentMarkers[clusterID]) {
              nextMarkers[clusterID] = createClusterMarker(cluster);
              nextMarkers[clusterID].setMap(map);
              nextMarkers[clusterID].setVisible(true);
            } else {
              nextMarkers[clusterID] = currentMarkers[clusterID];
              delete currentMarkers[clusterID];
            }
          });

          _.each(nextItems, function(item){
            if(!currentMarkers[item.id]) {
              nextMarkers[item.id] = createItemMarker(item);
              nextMarkers[item.id].setMap(map);
              nextMarkers[item.id].setVisible(true);
            } else {
              nextMarkers[item.id] = currentMarkers[item.id];
              delete currentMarkers[item.id];
            }
          });

          _.each(currentMarkers, function(marker){
            marker.setMap(null);
          });

          currentMarkers = nextMarkers;
        };

        // TODO replace the `else` part of this ternary operation with InventoryItemsService
        var dataFetcher = itemsAreReports ? ReportsItemsService.fetchClustered : function(options) {
          var params = { paginate: false, options: options};
          return scope.getData(params);
        };

        var lastRequestReference = null;
        var movedMap = function(){
          var mapCenter = map.getCenter();

          var options = {
            zoom: map.getZoom(),
            clusterize: true
          };

          var position = {'latitude': mapCenter.lat(), 'longitude': mapCenter.lng(), 'distance': getDistance()};

          $rootScope.mapDebug = _.extend({zoom: options['zoom']}, position);

          options['position[latitude]'] = position.latitude;
          options['position[longitude]'] = position.longitude;
          options['position[distance]'] = position.distance;

          options = _.extend(options, scope.getFiltersOptions());

          lastRequestReference = options;

          dataFetcher(options).then(function(response){
            // Using the `options` object reference of the latest request as guide as to whether or not to updated the
            // map based on it because by the time this function is called the user may have zoomed in or out already,
            // and so may cause flicker if the next request arises too close to this one
            if(lastRequestReference === options) {
              nextClusters = response.clusters;
              nextItems = response.items;
              refreshMap();
            }
          });
        };

        var isMarkerInsideBounds = function (marker) {
          return map.getBounds().contains(marker.getPosition());
        };

        var hideOutOfBoundsMarkers = function () {
          for (var i = currentMarkers.length - 1; i >= 0; i--) {
            if (isMarkerInsideBounds(currentMarkers[i])) {
              currentMarkers[i].setVisible(true);
            }
            else {
              currentMarkers[i].setVisible(false);
            }
          }
        };

        var prevZoomLevel = null;
        var timeout = null;

        var boundsChanged = function () {
          var currentZoom = map.getZoom();

          if (prevZoomLevel !== currentZoom) {
            prevZoomLevel = currentZoom;
          }

          if (timeout) {
            clearTimeout(timeout);
          }

          timeout = setTimeout(function () {
            movedMap();
            hideOutOfBoundsMarkers();
          }, 200);
        };

        google.maps.event.addListener(map, 'bounds_changed', function () {
          boundsChanged();
        });

        scope.$on('updateMap', function () {
          refreshMap();
          boundsChanged();
        });
      }
    }
  });
