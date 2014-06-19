'use strict';

angular.module('zupPainelApp')
  .directive('areaMap', function () {
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

          map: null,
          circles: [],
          lastListenerDistance: null,
          lastListenerPosition: null,

          DistanceWidget: function(map, position) {
            this.set('map', map);
            this.set('position', position);

            var marker = new google.maps.Marker({
              draggable: true,
              title: 'Me mova!',
              icon: 'data:image/png;base64,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'
            });

            // Bind the marker map property to the DistanceWidget map property
            marker.bindTo('map', this);

            // Bind the marker position property to the DistanceWidget position
            // property
            marker.bindTo('position', this);

            // Create a new radius widget
            var radiusWidget = new mapProvider.RadiusWidget(map);

            // Bind the radiusWidget map to the DistanceWidget map
            radiusWidget.bindTo('map', this);

            // Bind the radiusWidget center to the DistanceWidget position
            radiusWidget.bindTo('center', this, 'position');

            // Bind to the radiusWidgets' distance property
            this.bindTo('distance', radiusWidget);

            // Bind to the radiusWidgets' bounds property
            this.bindTo('bounds', radiusWidget);
          },

          RadiusWidget: function(map) {
            var circle = new google.maps.Circle({
              strokeWeight: 1,
              strokeColor: '#37A6CF',
              fillColor: '#37A6CF',
            });

            // Set the distance property value to be proportional to the screen size
            var center = map.getBounds().getCenter();
            var ne = map.getBounds().getNorthEast();

            var dis = google.maps.geometry.spherical.computeDistanceBetween(center, ne) / 1000; // in km! :D

            this.set('distance', dis / 3);

            // Bind the RadiusWidget bounds property to the circle bounds property.
            this.bindTo('bounds', circle);

            // Bind the circle center to the RadiusWidget center property
            circle.bindTo('center', this);

            // Bind the circle map to the RadiusWidget map
            circle.bindTo('map', this);

            // Bind the circle radius property to the RadiusWidget radius property
            circle.bindTo('radius', this);

            // Add the sizer marker
            this.addSizer_();
          },

          setHelpers: function() {
            mapProvider.DistanceWidget.prototype = new google.maps.MVCObject();

            mapProvider.RadiusWidget.prototype = new google.maps.MVCObject();

            mapProvider.RadiusWidget.prototype.distance_changed = function() { // jshint ignore:line
              this.set('radius', this.get('distance') * 1000);
            };

            mapProvider.RadiusWidget.prototype.addSizer_ = function() {
              var sizer = new google.maps.Marker({
                draggable: true,
                title: 'Me mova!',
                icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCQ0ZFMDg3REVGQjkxMUUzOEQ4OEY0ODJFNjA0QjFCRiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCQ0ZFMDg3RUVGQjkxMUUzOEQ4OEY0ODJFNjA0QjFCRiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkJDRkUwODdCRUZCOTExRTM4RDg4RjQ4MkU2MDRCMUJGIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkJDRkUwODdDRUZCOTExRTM4RDg4RjQ4MkU2MDRCMUJGIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+17E1nQAAA4dJREFUeNqsVmlME1EQnt1uD7cXh1DlMCZaWgTCpYjRxCvKEaMhUQigRn5qDDGoGEiM0UQSrwSPqGA0MdabxCNW4Yc/NEY5RcQoYWs8CIWKLh5Y27Ld9W2xtNAWFsuXTHf7dt588828fW8xjuNgMjx41SnppB12msHh1zALcmUYRCllMJuUQJEuHAMBwCYiqm7qSrzXO7z2s5XVoL/lgfwWRsihWBsOmbMU0khS7BBMdOs1FXmOsm3+NAnBeKTNJPfW5WiPCyI60diVUmuybxrmoBL+AyESEbwsSMQmJDr2oivtrMleiG73QBDAEc1qjWx77Rrd+dEx942hvTumxmQrAI7bAzx5EMayHLR+temev31D+hCd6rZtZTgo5/VNh9HD3K5jFLvTHZ/gfyofdyzrt3Hh3vKlSD+1JdmnLDVvLHC4rU9QCdu+s/F3OilJXpLW4VJk7GPXoEuZt5Od5YIi+YdtNz/+KXUpuvKsJYxmCMWI4MCwMizcpmgQ8oJ7o5F2Jrl61DHIfENzy/z1dVSdkwWSwOFq1nyIU8mmtDZQfvjVpnY93sNIgUXB/BmP0x39sPEhBb8cTtCQYriWjcjUsoBz/NjmXgfxDh9EAfhy+LPq9j6oajND68BvKKr3kF3Pngc6lTTgvPFGW+2e5e0PR9o9jW/9avUik8CNHL6M0tHnJfqIgHEYxgm4SsQKzqwFKStu8JDdytWCVimB0qRIqFgYFXBepEIO+Fw+qym8ic0WROalzLghHioWxYykHmBOYrQG8AwNqUGsl4Sq4q3JMgTFD7tdq1GJNlE3/PnyT3PnR2B4fnLclxAChqa6n6VrFCAVjWuxH7+VUUrPXpc3R2ZEEi8JLd+OxFlwYEmsb9d9fesK56nixxwTuovNJ2kGSmEakREqOmDMTz80ZvfelyAvJwC7j3E8e/CmxMFwMFVR5Y4vWpW7EjP3m7H1GekMahz91PwzHPlpgzkiCAyDwwnE4pyUJMcER/nH7KOvLI+c3P+VK1SMwYUsHayIVY85zn12ht2Zc+u1SuJMKIHdQOk9mIIUQ5pKtP9yplyJSHTmHpPYOy7hL6vVMTOeHFy+oK6qoXHdnT6R+YPVGYWG1wUQYUgNEVMlOvndonT9a/egTCpXocs3Qd91bjSZKLLxM/37vV02OkYSGMSK/8DSaLU0Rasf/y0X94O2DKrDNAPugb8CDAC75qtuzeZlUwAAAABJRU5ErkJggg=='
              });

              sizer.bindTo('map', this);
              sizer.bindTo('position', this, 'sizer_position');

              var me = this;
              google.maps.event.addListener(sizer, 'drag', function() {
                // Set the circle distance (radius)
                me.setDistance();
              });
            };

            mapProvider.RadiusWidget.prototype.center_changed = function() { // jshint ignore:line
              var bounds = this.get('bounds');

              // Bounds might not always be set so check that it exists first.
              if (bounds) {
                var lng = bounds.getNorthEast().lng();

                // Put the sizer at center, right on the circle.
                var position = new google.maps.LatLng(this.get('center').lat(), lng);
                this.set('sizer_position', position);
              }
            };

            mapProvider.RadiusWidget.prototype.distanceBetweenPoints_ = function(p1, p2) {
              if (!p1 || !p2) {
                return 0;
              }

              var R = 6371; // Radius of the Earth in km
              var dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
              var dLon = (p2.lng() - p1.lng()) * Math.PI / 180;
              var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
              var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
              var d = R * c;
              return d;
            };

            mapProvider.RadiusWidget.prototype.setDistance = function() {
              var pos = this.get('sizer_position');
              var center = this.get('center');
              var distance = this.distanceBetweenPoints_(center, pos);

              // Set the distance property for any objects that are bound to it
              this.set('distance', distance);
            };
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

            this.setHelpers();

            // and we create an event on click to create new circles
            google.maps.event.addListener(mapProvider.map, 'click', function (a) {
              mapProvider.addCircle(a.latLng);
            });
          },

          setLastCircleInfo: function(widget) {
            scope.lastCirclePosition = widget.get('position');
            scope.lastCircleDistance = widget.get('distance');
            scope.lastCircleArea = (widget.get('distance') * widget.get('distance') * Math.PI);
          },

          addCircle: function(latLng) {
            var newCircle = new mapProvider.DistanceWidget(mapProvider.map, latLng);

            mapProvider.circles.push(newCircle);
            mapProvider.setLastCircleInfo(newCircle);

            // add listeners for user changes in the last circle
            google.maps.event.removeListener(mapProvider.lastListenerDistance);
            google.maps.event.removeListener(mapProvider.lastListenerPosition);

            mapProvider.lastListenerDistance = google.maps.event.addListener(newCircle, 'distance_changed', function() { // jshint ignore:line
              mapProvider.setLastCircleInfo(newCircle);
            });

            mapProvider.lastListenerPosition = google.maps.event.addListener(newCircle, 'position_changed', function() { // jshint ignore:line
              mapProvider.setLastCircleInfo(newCircle);
            });
          }
        };

        mapProvider.createMap();

        scope.$parent.circles = mapProvider.circles;
        scope.map = mapProvider.map;

        // helper functions for the modal
        scope.eraseAllCircles = function() {
          for (var i = mapProvider.circles.length - 1; i >= 0; i--) {
            mapProvider.circles[i].set('map', null);
          }

          mapProvider.circles = [];
        };

        scope.eraseLastCircle = function() {
          mapProvider.circles[mapProvider.circles.length - 1].set('map', null);

          mapProvider.circles.splice(mapProvider.circles.length - 1, 1);
        };

        scope.fitCirclesBounds = function() {
          if (mapProvider.circles.length === 0)
          {
            return;
          }

          var latlngbounds = new google.maps.LatLngBounds();

          // we add each "radius" outermost northEast point and southWest point to the bounds
          for (var i = mapProvider.circles.length - 1; i >= 0; i--) {
            latlngbounds.extend(mapProvider.circles[i].get('bounds').getNorthEast());
            latlngbounds.extend(mapProvider.circles[i].get('bounds').getSouthWest());
          }

          // now we make the map fit inside all of those bounds :-)
          mapProvider.map.fitBounds(latlngbounds);
        };

        scope.addCircleByLatLng = function(lat, lng) {
          mapProvider.addCircle(new google.maps.LatLng(lat, lng));

          scope.fitCirclesBounds();
        };
      }
    };
  });
