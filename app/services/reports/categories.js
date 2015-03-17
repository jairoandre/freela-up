'use strict';

/**
 * Provides an API client for the reports categories from ZUP API
 * @module ReportsCategoriesService
 */
angular
  .module('ReportsCategoriesServiceModule', [])
  .factory('ReportsCategoriesService', function ($rootScope, FullResponseRestangular) {
    var self = {};
    self.categories = {};
    self.categoriesStatuses = {};
    self.loadedBasicInfo = false;

    /**
     * Process local categories and statuses refreshing
     * @param {Object} response - FullResponseRestangular response object
     */
    var updateCache = function (response) {
      _.each(response.data.categories, function (category) {
        _.each(category.subcategories, function (subcategory) {
          if (typeof self.categories[subcategory.id] === 'undefined') {
            self.categories[subcategory.id] = subcategory;
          }
        });

        if (typeof self.categories[category.id] === 'undefined') {
          self.categories[category.id] = category;
        }
        _.each(category.statuses, function (status) {
          if (typeof self.categoriesStatuses[status.id] === 'undefined') {
            self.categoriesStatuses[status.id] = status
          }
        });
      });

      $rootScope.$emit('reportsCategoriesFetched', self.categories);
    };

    /**
     * Fetches basic information for all categories
     * @returns {Object} Restangular promise for basic category fields fetching
     */
    self.fetchAllBasicInfo = function () {
      var url = FullResponseRestangular.all('reports').all('categories'), options = { };

      options.display_type = 'full'; // temporarily set display_type as full while API is being updated TODO
      options.return_fields = [
        'id', 'title', 'statuses.id', 'statuses.color', 'statuses.title',
        'subcategories.id', 'subcategories.title', 'subcategories.statuses.id', 'subcategories.statuses.color', 'subcategories.statuses.title,'
      ].join();

      var promise = url.customGET(null, options);

      promise.then(function(response){
        self.loadedBasicInfo = true;
        updateCache(response);
      });

      return promise;
    };

    return self;
  });
