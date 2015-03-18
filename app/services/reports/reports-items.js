'use strict';

/**
 * Provides an API client for the reports items from ZUP API
 * @module ReportsItemsServiceModule
 */
angular
  .module('ReportsItemsServiceModule', ['ReportsCategoriesServiceModule'])
  .factory('ReportsItemsService', function ($q, $rootScope, FullResponseRestangular, ReportsCategoriesService) {
    var self = {}, reportsOrder = 0;
    self.reports = {};
    self.total = 0;

    /**
     * Fetches report items using hte search report endpoint
     * @param {Object} options - API options for the search report endpoint
     * @returns {Object} promise called for successful responses alone
     */
    self.fetchAll = function (options) {
      options = options || {};

      var url = FullResponseRestangular.one('search').all('reports').all('items'); // jshint ignore:line

      options.display_type = 'full'; // temporarily set display_type as full while API is being updated TODO
      options.return_fields = [
        'id', 'protocol', 'address', 'category_id', 'status_id', 'created_at', 'overdue', // Report properties
        'user.name', 'user.id' // User properties
      ].join();

      var categoryFetchPromise = ReportsCategoriesService.fetchAllBasicInfo();

      var promise = url.customGET(null, options);

      var deferred = $q.defer();

      promise.then(function (response) {
        _.each(response.data.reports, function (report) {
          if (typeof self.reports[report.id] === 'undefined') {
            self.reports[report.id] = report;
            report.order = reportsOrder++;
          }
        });

        self.total = parseInt(response.headers().total, 10);
        if (_.size(ReportsCategoriesService.categories) < 1) {
          categoryFetchPromise.then(function () {
            hookCategoryFieldsOnReports();
            $rootScope.$emit('reportsItemsFetched', self.reports);
            deferred.resolve(self.reports);
          });
        } else {
          hookCategoryFieldsOnReports();
          $rootScope.$emit('reportsItemsFetched', self.reports);
          deferred.resolve(self.reports);
        }
      });

      return deferred.promise;
    };

    /**
     * Clear current reports
     */
    self.resetCache = function () {
      self.reports = {};
      reportsOrder = 0;
    };

    /**
     * Removes a single report from the API and the local cache
     * @param {Integer|String} report_id - The report ID to remove
     * @returns {*}
     */
    self.remove = function (report_id) {
      var promise = FullResponseRestangular.one('reports').one('items', report_id).remove(), deferred = $q.defer();
      promise.then(function () {
        delete self.reports[report_id];
        deferred.resolve();
      });

      return deferred.promise;
    };

    /**
     * Sets the category property and reports
     * Due to performance reasons, categories are fetched in parallel to the items themselves, so they need to be bound
     * the `category` object
     * @private
     */
    var hookCategoryFieldsOnReports = function () {
      _.each(self.reports, function (report) {
        report.category = ReportsCategoriesService.categories[report.category_id];
        if (typeof report.category === 'undefined') {
          console.log('Report with unknown category', report);
        }
        report.status = ReportsCategoriesService.categoriesStatuses[report.status_id];
      });
    };

    return self;
  });
