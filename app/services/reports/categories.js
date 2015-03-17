'use strict';

angular
  .module('ReportsCategoriesServiceModule', [])
  .factory('ReportsCategoriesService', function ($rootScope, FullResponseRestangular) {
    var self = {};
    self.categories = {};
    self.categoriesStatuses = {};

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

    self.fetchAllBasicInfo = function () {
      var url = FullResponseRestangular.all('reports').all('categories'), options = { };

      options.display_type = 'full'; // temporarily set display_type as full while API is being updated TODO
      options.return_fields = [
        'id', 'title', 'statuses.id', 'statuses.color',
        'subcategories.id', 'subcategories.title', 'subcategories.statuses.id', 'subcategories.statuses.color'
      ].join();

      var promise = url.customGET(null, options);

      promise.then(updateCache);

      return promise;
    };

    return self;
  });
