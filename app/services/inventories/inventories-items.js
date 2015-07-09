'use strict';

/**
 * Provides an API client for the items from ZUP API
 * @module InventoriesItemsServiceModule
 */
angular
  .module('InventoriesItemsServiceModule', ['InventoriesCategoriesServiceModule'])
  .factory('InventoriesItemsService', function ($q, $rootScope, FullResponseRestangular, InventoriesCategoriesService) {
    var self = {}, itemsOrder = 0;
    self.items = {};
    self.total = 0;
    self.clusters = [];

    /**
     * Clear service state
     */
    self.resetCache = function () {
      self.items = {};
      self.clusters = [];
      self.total = 0;
      itemsOrder = 0;
    };

    /**
     * Clears items and clusters, but not total
     */
    self.resetItemsAndClusters = function(){
      itemsOrder = 0;
      self.items = {};
      self.clusters = [];
    };

    /**
     * Fetches items using hte search report endpoint
     * @param {Object} options - API options for the search endpoint
     * @returns {Object} promise called for successful responses alone
     */
    self.fetchAll = function (options) {
      options = options || {};

      var url = FullResponseRestangular.one('search').all('inventory').all('items'); // jshint ignore:line

      options.display_type = 'full'; // temporarily set display_type as full while API is being updated TODO
      options.return_fields = [
        'id', 'title', 'address', 'created_at', 'updated_at', 'inventory_status_id', // Item properties
        'inventory_category_id', // Item's Category properties
        'user.name', 'user.id' // User properties
      ].join();

      // Categories are always updated in parallel on fetch operations
      var categoryFetchPromise = InventoriesCategoriesService.fetchAllBasicInfo();

      var promise = url.customGET(null, options);

      var deferred = $q.defer();

      $rootScope.$broadcast('inventoriesItemsFetching');

      promise.then(function (response) {
        _.each(response.data.items, function (item)
        {
          if (typeof self.items[item.id] === 'undefined')
          {
            item.order = itemsOrder++;
          }

          self.items[item.id] = item;
        });

        self.total = parseInt(response.headers().total, 10);

        // If there isn't any category on cache, we wait on them before presenting items
        if (_.size(InventoriesCategoriesService.categories) < 1)
        {
          categoryFetchPromise.then(function () {
            hookCategoryFieldsOnReports();

            $rootScope.$broadcast('inventoriesItemsFetched', self.items);

            deferred.resolve(self.items);
          });
        }
        else
        {
          // TODO This may cause problems for items of categories that are not yet present
          hookCategoryFieldsOnReports();

          $rootScope.$broadcast('inventoriesItemsFetched', self.items);

          deferred.resolve(self.items);
        }
      });

      return deferred.promise;
    };

    /**
     * Fetches items items and clusters for a given position. Unordered.
     * @param options - API request options
     */
    self.fetchClustered = function (options) {
      var url = FullResponseRestangular.one('search').all('inventory').all('items'); // jshint ignore:line

      options.return_fields = [
        'id', 'title', 'address', 'created_at', 'updated_at', 'inventory_status_id', 'position', // Item properties
        'inventory_category_id', // Item's Category properties
        'user.name', 'user.id' // User properties
      ].join();

      var categoryFetchPromise = InventoriesCategoriesService.fetchAllBasicInfo();

      var itemsFetchPromise = url.customGET(null, options);

      var deferred = $q.defer();

      $rootScope.$broadcast('inventoriesItemsFetching');

      itemsFetchPromise.then(function (response) {
        self.total = parseInt(response.headers().total, 10);

        _.each(response.data.items, function (item) {
          if (typeof self.items[item.id] === 'undefined')
          {
            item.order = itemsOrder++;
          }

          self.items[item.id] = item;
        });

        self.clusters = response.data.clusters;

        if (_.size(InventoriesCategoriesService.categories) < 1)
        {
          categoryFetchPromise.then(function () {
            hookCategoryFieldsOnClusters();

            hookCategoryFieldsOnReports();

            $rootScope.$broadcast('inventoriesItemsFetched', self.items);

            deferred.resolve(self);
          });
        }
        else
        {
          hookCategoryFieldsOnClusters();

          hookCategoryFieldsOnReports();

          $rootScope.$broadcast('inventoriesItemsFetched', self.items);

          deferred.resolve(self);
        }
      });

      return deferred.promise;
    };

    /**
     * Removes a single item from the API and the local cache
     * @param {Integer|String} report_id - The item ID to remove
     * @returns {*}
     */
    self.remove = function (report_id, category_id) {
      var promise = FullResponseRestangular.one('inventory').one('categories', category_id).one('items', report_id).remove(), deferred = $q.defer();

      promise.then(function () {
        delete self.items[report_id];

        deferred.resolve();
      });

      return deferred.promise;
    };

    /**
     * Binds categories to either items items or clusters
     * @private
     * @param {Array|Object} items - items to bind the `category` property on
     */
    var setCategoryOnItems = function(items) {
      return _.each(items, function (item) {
        item.category = InventoriesCategoriesService.categories[item.inventory_category_id] || InventoriesCategoriesService.categories[item.category_id];

        if (typeof item.category === 'undefined')
        {
          console.log('Report with unknown category', item);
        }

        item.status = InventoriesCategoriesService.categoriesStatuses[item.inventory_status_id];
      });
    };

    /**
     * Sets the category property on items
     * Due to performance reasons, categories are fetched in parallel to the items themselves, so they need to be bound
     * the `category` object
     * @private
     */
    var hookCategoryFieldsOnReports = function () {
      setCategoryOnItems(self.items);
    };

    /**
     * Sets the category property on clusters
     * Due to performance reasons, categories are fetched in parallel to the items themselves, so they need to be bound
     * the `category` object
     * @private
     */
    var hookCategoryFieldsOnClusters = function () {
      setCategoryOnItems(self.clusters);
    };

    return self;
  });
