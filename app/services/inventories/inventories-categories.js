'use strict';

/**
 * Provides an API client for the reports categories from ZUP API
 * @module InventoriesCategoriesService
 */
angular
  .module('InventoriesCategoriesServiceModule', [])
  .factory('InventoriesCategoriesService', function ($rootScope, FullResponseRestangular) {
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
          self.categories[subcategory.id] = subcategory;
        });

        self.categories[category.id] = category;

        _.each(category.statuses, function (status) {
          self.categoriesStatuses[status.id] = status
        });
      });

      $rootScope.$emit('inventoriesCategoriesFetched', self.categories);
    };

    /**
     * Fetches basic information for all categories
     * This function is safe to call multiple times and will not duplicate categories in the cache
     * @returns {Object} Restangular promise for basic category fields fetching
     */
    self.fetchAllBasicInfo = function () {
      var url = FullResponseRestangular.all('inventory').all('categories'), options = { };

      options.display_type = 'full'; // temporarily set display_type as full while API is being updated TODO
      options.return_fields = ['id', 'title', 'statuses.id', 'statuses.color', 'statuses.title', 'marker.retina.web', 'pin', 'plot_format', 'color'].join();

      var promise = url.customGET(null, options);

      promise.then(function (response) {
        self.loadedBasicInfo = true;
        updateCache(response);
      });

      return promise;
    };

    return self;
  });
