'use strict';

angular
  .module('GoogleMapServiceModule', [])
  .factory('GoogleMapService', function (ENV) {

    var _options = {styles:[{},{featureType:"poi.business",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"poi.government",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"poi.medical",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"poi.place_of_worship",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"poi.school",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"poi.sports_complex",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"transit",elementType:"labels",stylers:[{visibility:"off"},{saturation:-100},{lightness:42}]},{featureType:"road.highway",elementType:"geometry.fill",stylers:[{saturation:-100},{lightness:47}]},{featureType:"landscape",stylers:[{lightness:82},{saturation:-100}]},{featureType:"water",stylers:[{hue:"#00b2ff"},{saturation:-21},{lightness:-4}]},{featureType:"poi",stylers:[{lightness:19},{weight:.1},{saturation:-22}]},{elementType:"geometry.fill",stylers:[{visibility:"on"},{lightness:18}]},{elementType:"labels.text",stylers:[{saturation:-100},{lightness:28}]},{featureType:"poi.attraction",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"poi.park",elementType:"geometry.fill",stylers:[{saturation:12},{lightness:25}]},{featureType:"road",elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"road",elementType:"labels.text",stylers:[{lightness:30}]},{featureType:"landscape.man_made",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"road.highway",elementType:"geometry",stylers:[{saturation:-100},{lightness:56}]},{featureType:"road.local",elementType:"geometry.fill",stylers:[{lightness:62}]},{featureType:"landscape.man_made",elementType:"geometry",stylers:[{visibility:"off"}]}],map:{zoom: null,mapTypeControl:!1,panControl:!0,panControlOptions:{position:google.maps.ControlPosition.TOP_RIGHT},zoomControl:!0,zoomControlOptions:{position:google.maps.ControlPosition.TOP_RIGHT},scaleControl:!0,scaleControlOptions:{position:google.maps.ControlPosition.TOP_RIGHT},streetViewControl:!0,streetViewControlOptions:{position:google.maps.ControlPosition.TOP_RIGHT}}};

    /***
    *  Creates a new Google Map canvas
    *
    *  @param itemsAreReports {bool} - True is the items that will be plotted into the map are reports
    *  @param mapLat {float} - Initial map latitute
    *  @param mapLng {float} - Initial map longitude
    *  @param mapZoom {int} - Initial map zoom
    *  @param mapElement {Element} - Element object that binds to the map
    */
    var Map = function(itemsAreReports, mapLat, mapLng, mapZoom, mapElement) {
      _options.map.zoom = mapZoom;

      // we define some helpers
      var homeLatlng = new google.maps.LatLng(mapLat, mapLng);
      var styledMap = new google.maps.StyledMapType(_options.styles, { name: 'zup' });

      // we set the type of items the map will handle
      this.itemsAreReports = itemsAreReports;

      // we bind the google maps to out element
      this.map = new google.maps.Map(mapElement, _options.map);

      this.map.mapTypes.set('zup', styledMap);
      this.map.setMapTypeId('zup');
      this.map.setCenter(homeLatlng);

      // we also initialize a few variables that we are going to use it :-D
      this.currentMarkers = {};
    };

    Map.prototype.getDistance = function() {
      var bounds = this.map.getBounds();

      var center = bounds.getCenter();
      var ne = bounds.getNorthEast();

      return google.maps.geometry.spherical.computeDistanceBetween(center, ne);
    };

    Map.prototype.clearMarkers = function() {
      _.each(this.currentMarkers, function(marker) {
        marker.setMap(null);
      });

      this.currentMarkers = {};
    };

    Map.prototype.createMarker = function(position, markerImage, color, count, extraData) {
      var html;

      if(!_.isNull(markerImage)) {
        var extraClass = markerImage.isPin ? 'pin' : '';

        html = '<div class="marker ' + extraClass + '" style="background-image: url(' + markerImage.url + ')">';
      } else {
        html = '<div class="marker">';
      }


      if (count)
      {
        html += '<span style="background-color: ' + color + ';">' + count + '</span>';
      }

      html += '</div>';

      var marker = new RichMarker({
        position: position,
        map: this.map,
        draggable: false,
        shadow: false,
        content: html,
        extraData: extraData
      });

      return marker;
    };

    Map.prototype.createClusterMarker = function(cluster) {
      var position = new google.maps.LatLng(cluster.position[0], cluster.position[1]);

      return this.createMarker(position, null, cluster.category.color, cluster.count);
    };

    Map.prototype.createItemMarker = function(item) {
      var markerImage = {};

      if (!this.itemsAreReports && item.category.plot_format === 'pin')
      {
        markerImage.url = item.category.pin.retina.web;
        markerImage.isPin = true;
      }
      else
      {
        markerImage.url = item.category.marker.retina.web;
        markerImage.isPin = false;
      }

      var position = new google.maps.LatLng(item.position.latitude, item.position.longitude);
      var marker = this.createMarker(position, markerImage, false, false, { category: item.category, item: item });

      //google.maps.event.addListener(marker, 'click', displayInfoWindow);

      return marker;
    };

    Map.prototype.processMarkers = function(nextClusters, nextItems) {
      var nextMarkers = {}, _self = this;

      _.each(nextClusters, function(cluster) {
        if (_.isUndefined(cluster.category) || !cluster.category) return false;

        var clusterID = (cluster.position[0]).toString() + cluster.position[1] + cluster.count + cluster.category_id;

        if(!_self.currentMarkers[clusterID])
        {
          nextMarkers[clusterID] = _self.createClusterMarker(cluster);
          nextMarkers[clusterID].setMap(_self.map);
          nextMarkers[clusterID].setVisible(true);
        }
        else
        {
          nextMarkers[clusterID] = _self.currentMarkers[clusterID];
          delete _self.currentMarkers[clusterID];
        }
      });

      _.each(nextItems, function(item) {
        if(!_self.currentMarkers[item.id])
        {
          nextMarkers[item.id] = _self.createItemMarker(item);
          nextMarkers[item.id].setMap(_self.map);
          nextMarkers[item.id].setVisible(true);
        }
        else
        {
          nextMarkers[item.id] = _self.currentMarkers[item.id];
          delete _self.currentMarkers[item.id];
        }
      });

      _.each(this.currentMarkers, function(marker) {
        marker.setMap(null);
      });

      this.currentMarkers = nextMarkers;
    };

    Map.prototype.isMarkerInsideBounds = function(marker) {
      return this.map.getBounds().contains(marker.getPosition());
    };

    Map.prototype.hideOutOfBoundsMarkers = function() {
      var self = this;

      _.each(this.currentMarkers, function(marker) {
        if (self.isMarkerInsideBounds(marker))
        {
          marker.setVisible(true);
        }
        else
        {
          marker.setVisible(false);
        }
      });
    };

    Map.prototype.getMap = function() {
      return this.map;
    };

    Map.prototype.getZoom = function() {
      return this.map.getZoom();
    };

    Map.prototype.getCenter = function() {
      return this.map.getCenter();
    };

    return Map;

  });
