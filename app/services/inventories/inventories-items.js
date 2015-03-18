'use strict';

/**
 * Provides an API client for the inventory's items from ZUP API
 * @module InventoriesItemsServiceModule
 */
angular
  .module('InventoriesItemsServiceModule', [
    'InventoriesCategoriesServiceModule'
  ])

  .factory('InventoriesItemsService', function ($q, $rootScope, FullResponseRestangular, InventoriesCategoriesService) {
    var self = {};
    var itemsOrder = 0;

    self.items = {};
    self.total = 0;

    /**
     * Fetches item items using hte search item endpoint
     * @param {Object} options - API options for the search item endpoint
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

      var categoryFetchPromise = InventoriesCategoriesService.fetchAllBasicInfo();

      var promise = url.customGET(null, options);

      var deferred = $q.defer();

      promise.then(function (response) {
        _.each(response.data.items, function (item) {
          if (typeof self.items[item.id] === 'undefined')
          {
            self.items[item.id] = item;
            item.order = itemsOrder++;
          }
        });

        self.total = parseInt(response.headers().total, 10);

        if (_.size(InventoriesCategoriesService.categories) < 1)
        {
          categoryFetchPromise.then(function () {
            hookCategoryFieldsOnItems();

            $rootScope.$emit('inventoriesItemsFetched', self.items);

            deferred.resolve(self.items);
          });
        }
        else
        {
          hookCategoryFieldsOnItems();
          $rootScope.$emit('inventoriesItemsFetched', self.items);

          deferred.resolve(self.items);
        }
      });

      return deferred.promise;
    };

    /**
     * Clear current items
     */
    self.resetCache = function () {
      self.items = {};
      itemsOrder = 0;
    };

    /**
     * Removes a single item from the API and the local cache
     * @param {Integer|String} item_id - The item ID to remove
     * @returns {*}
     */
    self.remove = function (item_id) {
      var promise = FullResponseRestangular.one('inventory').one('items', item_id).remove(),
          deferred = $q.defer();

      promise.then(function () {
        delete self.items[item_id];

        deferred.resolve();
      });

      return deferred.promise;
    };

    /**
     * Sets the category property and items
     * Due to performance reasons, categories are fetched in parallel to the items themselves, so they need to be bound
     * the `category` object
     * @private
     */
    var hookCategoryFieldsOnItems = function () {
      _.each(self.items, function (item) {
        item.category = InventoriesCategoriesService.categories[item.inventory_category_id];

        if (typeof item.category === 'undefined')
        {
          console.log('Item with unknown category', item);
        }

        item.status = InventoriesCategoriesService.categoriesStatuses[item.inventory_status_id];
      });
    };

    return self;
  });
