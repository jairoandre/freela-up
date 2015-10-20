'use strict';

/**
 * Provides an API client for the reports perimeters from ZUP API
 * @module ReportsPerimeters
 * @author Jairo André (jairo.andre@gmail.com)
 */
angular
  .module('ReportsPerimetersServiceModule', [])
  .factory('ReportsPerimetersService', function (Restangular, FullResponseRestangular, $rootScope, $q, $log) {

    var service = {};

    service.perimeters = [];

    service.listAllReturnFields = [
      'id',
      'title',
      'shp_file',
      'shx_file',
      'status',
      'geometry'
    ];

    service.cleanCache = function () {
      $log.info('Cleaning perimeters cache.');
      service.perimeters = [];
    };

    /**
     * Retrieve all perimeters
     *
     * @returns {*}
     */
    service.listAll = function () {
      $log.info('Listing all perimeters');

      var options = {
        display_type : 'full',
        return_fields : [
          'id',
          'title',
          'shp_file',
          'shx_file',
          'status',
          'geometry',
          'created_at'].join()
      };


      var promise = FullResponseRestangular
        .one('reports')
        .all('perimeters')
        .customGET(null, options);

      var deferred = $q.defer();

      promise.then(function (resp) {
        service.perimeters = resp.data.perimeters;
        //_.each(resp.data.perimeters, function (r) {
        //  service.perimeters[r.id] = r;
        //});
        deferred.resolve(service.perimeters);
        $rootScope.$broadcast('perimetersFetched');
      });

      return deferred.promise;
    };

    /**
     * Add a new perimeter
     *
     * @param perimeter
     * @returns {*}
     */
    service.addPerimeter = function (perimeter) {
      $log.info('Adding new perimeter/region [title: ' + perimeter.title + ', shp_file: ' + perimeter.shp_file.file_name + ', shx_file: ' + perimeter.shx_file.file_name + ']');
      perimeter.return_fields = 'id';
      return Restangular
        .one('reports')
        .withHttpConfig({treatingErrors: true})
        .post('perimeters', perimeter);
    };

    /**
     * Update an existing perimeter
     *
     * @param perimeter
     * @returns {*}
     */
    service.updatePerimeter = function (perimeter) {
      $log.info('Update an existing perimeter/region [title: ' + perimeter.title + ', id: ' + perimeter.id + ']');
      perimeter.return_fields = 'id';
      return Restangular
        .one('reports')
        .one('perimeters', perimeter.id)
        .withHttpConfig({treatingErrors: true})
        .customPUT({title: perimeter.title});
    };

    /**
     * Delete the perimeter
     *
     * @param perimeter
     * @returns {*}
     */
    service.deletePerimeter = function (perimeter) {
      $log.info('Deleting perimeter/region [id: ' + perimeter.title + ', id: ' + perimeter.id + ']');
      return Restangular
        .one('reports')
        .withHttpConfig({treatingErrors: true})
        .one('perimeters', perimeter.id).remove();
    }

    return service;
  });
