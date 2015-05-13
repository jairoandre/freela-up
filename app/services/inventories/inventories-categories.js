'use strict';

/**
 * Provides an API client for the reports categories from ZUP API
 * @module InventoriesCategoriesService
 */
angular
  .module('InventoriesCategoriesServiceModule', [])
  .factory('InventoriesCategoriesService', function ($rootScope, Restangular, FullResponseRestangular) {
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
        self.categories[category.id] = category;

        _.each(category.statuses, function (status) {
          self.categoriesStatuses[status.id] = status
        });
      });

      $rootScope.$emit('inventoriesCategoriesFetched', self.categories);
    };

    /**
     * Clears current cache
     * @returns {Object} Restangular promise for basic category fields
     */
    self.purgeCache = function() {
      self.categories = {};
      self.categoriesStatuses = {};
      self.loadedBasicInfo = false;

      return self.fetchAllBasicInfo();
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

    /**
     * Get an inventory category by it's ID
     * @param  {int|string} id reqyested ategory ID
     * @return {Object} Restangular promise with full info about the category
     */
    self.getCategory = function(id) {
      // TODO we must implement a cached version
      var promise = Restangular.one('inventory').one('categories', id).get({display_type: 'full'});

      return promise;
    };

    return self;
  });
