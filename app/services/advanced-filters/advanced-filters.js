'use strict';

angular
  .module('AdvancedFiltersServiceModule', [
    'AdvancedFiltersQueryModalControllerModule',
    'AdvancedFiltersCategoryModalControllerModule',
    'AdvancedFiltersStatusModalControllerModule',
    'AdvancedFiltersAuthorModalControllerModule',
    'AdvancedFiltersPeriodModalControllerModule',
    'AdvancedFiltersAreaModalControllerModule',
    'AdvancedFiltersFieldsModalControllerModule',
    'AdvancedFiltersShareModalControllerModule'
  ])

  /* This file contains common filters used by inventory/reports */
  .factory('AdvancedFilters', function ($modal, Restangular, $q, $location) {
    return {
      // advanced filter by category
      query: function (activeAdvancedFilters) {
        $modal.open({
          templateUrl: 'modals/advanced-filters/query/advanced-filters-query.template.html',
          windowClass: 'filterQueryModal',
          resolve: {
            activeAdvancedFilters: function() {
              return activeAdvancedFilters;
            }
          },
          controller: 'AdvancedFiltersQueryModalController'
        });
      },

      // advanced filter by category
      category: function (categories, activeAdvancedFilters) {
        $modal.open({
          templateUrl: 'modals/advanced-filters/category/advanced-filters-category.template.html',
          windowClass: 'filterCategoriesModal',
          resolve: {
            categories: function() {
              return categories;
            },

            activeAdvancedFilters: function() {
              return activeAdvancedFilters;
            }
          },
          controller: 'AdvancedFiltersCategoryModalController'
        });
      },

      // advanced filter by status
      status: function(categories, statuses, activeAdvancedFilters) {
        $modal.open({
          templateUrl: 'modals/advanced-filters/status/advanced-filters-status.template.html',
          windowClass: 'filterStatusesModal',
          resolve: {
            categories: function() {
              return categories;
            },

            statuses: function() {
              return statuses;
            },

            activeAdvancedFilters: function() {
              return activeAdvancedFilters;
            }
          },
          controller: 'AdvancedFiltersStatusModalController'
        });
      },

      // advanced filter by the author of the item
      author: function(activeAdvancedFilters) {
        $modal.open({
          templateUrl: 'modals/advanced-filters/author/advanced-filters-author.template.html',
          windowClass: 'filterAuthorModal',
          resolve: {
            activeAdvancedFilters: function() {
              return activeAdvancedFilters;
            }
          },
          controller: 'AdvancedFiltersAuthorModalController'
        });
      },

      // advanced filter by date
      period: function(activeAdvancedFilters) {
        $modal.open({
          templateUrl: 'modals/advanced-filters/period/advanced-filters-period.template.html',
          windowClass: 'filterPeriodModal',
          resolve: {
            activeAdvancedFilters: function() {
              return activeAdvancedFilters;
            }
          },
          controller: 'AdvancedFiltersPeriodModalController'
        });
      },

      // advanced filter by geographic area
      area: function(activeAdvancedFilters) {
        return $modal.open({
          templateUrl: 'modals/advanced-filters/area/advanced-filters-area.template.html',
          windowClass: 'filterAreaModal',
          resolve: {
            activeAdvancedFilters: function() {
              return activeAdvancedFilters;
            }
          },
          controller: 'AdvancedFiltersAreaModalController'
        });
      },

      fields: function(categories, activeAdvancedFilters) {
        $modal.open({
          templateUrl: 'modals/advanced-filters/fields/advanced-filters-fields.template.html',
          windowClass: 'fieldsCategoriesModal',
          resolve: {
            categories: function() {
              return categories;
            },

            activeAdvancedFilters: function() {
              return activeAdvancedFilters;
            }
          },
          controller: 'AdvancedFiltersFieldsModalController'
        });
      },

      share: function() {
        $modal.open({
          templateUrl: 'modals/advanced-filters/share/advanced-filters-share.template.html',
          windowClass: 'shareModal',
          resolve: {
            url: function() {
              var deferred = $q.defer();

              var request = gapi.client.urlshortener.url.insert({
                'resource': {'longUrl': $location.absUrl()}
              });

              request.execute(function(response) {
                deferred.resolve(response.id);
              });

              return deferred.promise;
            }
          },
          controller: 'AdvancedFiltersShareModalController'
        });
      }
    };
  });
