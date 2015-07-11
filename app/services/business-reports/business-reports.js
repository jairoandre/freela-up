'use strict';

/**
 * Provides an API client for the business reports from ZUP API
 * @module BusinessReportsServiceModule
 */
angular
  .module('BusinessReportsServiceModule', [])
  .factory('BusinessReportsService', function ($q, FullResponseRestangular) {
    var unmarshall = function(report){
      report.begin_date = new Date(report.begin_date);
      report.end_date = new Date(report.end_date);
      return report;
    };

    /**
     * Fetches report items using hte search report endpoint
     * @param {Object} options - API options for the search report endpoint
     * @returns {Object} promise called for successful responses alone
     */
    self.fetchAll = function (options) {
      options = options || {};

      var url = FullResponseRestangular.all('business_reports');

      options.display_type = 'full';
      options.return_fields = [
        'id', 'title', 'summary', 'begin_date', 'end_date'
      ].join();

      var promise = url.customGET(null, options);

      var deferred = $q.defer();

      promise.then(function (response) {
        var reports = response.data;

        deferred.resolve(reports.map(unmarshall));
      }, function (response) {
        deferred.reject(response);
      });

      return deferred.promise;
    };

    return self;
  });
