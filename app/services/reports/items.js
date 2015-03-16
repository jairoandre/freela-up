'use strict';

angular
  .module('ReportsItemsServiceModule', ['ReportsCategoriesServiceModule'])
  .factory('ReportsItemsService', function ($q, $rootScope, FullResponseRestangular, ReportsCategoriesService) {
    var self = {};
    self.reports = {};
    self.total = 0;

    self.fetchAll = function (options) {
      options = options || {};

      var url = FullResponseRestangular.one('search').all('reports').all('items'); // jshint ignore:line

      options.display_type = 'full'; // temporarily set display_type as full while API is being updated TODO
      options.return_fields = [
        'id', 'protocol', 'address', 'category_id', 'status_id', 'created_at', // Report properties
        'user.name', 'user.id' // User properties
      ].join();

      var fetchingCategories = false, fetchingCategoriesPromise;
      if (_.size(ReportsCategoriesService.categories) < 1) {
        fetchingCategoriesPromise = ReportsCategoriesService.fetchAllBasicInfo();
        fetchingCategories = true;
      }

      var promise = url.customGET(null, options);

      var deferred = $q.defer();

      promise.then(function (response) {
        _.each(response.data.reports, function(report){
          if(typeof self.reports[report.id] === 'undefined') {
            self.reports[report.id] = report;
          }
        });

        self.total = parseInt(response.headers().total, 10);
        if (fetchingCategories) {
          fetchingCategoriesPromise.then(function () {
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
