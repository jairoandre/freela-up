'use strict';

/**
 * Provides an API client for the reports categories from ZUP API
 * @module ReportsCategoriesService
 */
angular
  .module('ReportsCategoriesServiceModule', [])
  .factory('ReportsCategoriesService', function ($rootScope, FullResponseRestangular, $q) {
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

      $rootScope.$emit('reportsCategoriesFetched', self.categories);
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
      var url = FullResponseRestangular.all('reports').all('categories'), options = { };

      options.display_type = 'full'; // temporarily set display_type as full while API is being updated TODO
      options.subcategories_flat = true;
      options.return_fields = [
        'id', 'title', 'statuses.id', 'statuses.color', 'statuses.title', 'marker.retina.web', 'pin', 'parent_id', 'color', 'icon'
      ].join();

      var promise = url.customGET(null, options);

      promise.then(function (response) {
        self.loadedBasicInfo = true;
        updateCache(response);
      });

      return promise;
    };

    /**
     * Fetches id, title and subcategories
     * @returns {Array} fetched categories
     */
    self.fetchTitlesAndIds = function(){
      var request = FullResponseRestangular.all('reports').all('categories'), deferred = $q.defer(), options = {};

      options.display_type = 'full'; // temporarily set display_type as full while API is being updated TODO
      options.subcategories_flat = false;
      options.return_fields = [ 'id', 'title', 'subcategories.id', 'subcategories.title' ].join();

      var promise = request.customGET(null, options);

      promise.then(function (response) {
        deferred.resolve(response.data.categories);
      }, function(response){
        deferred.reject(response);
      });

      return deferred.promise;
    };

    return self;
  });
