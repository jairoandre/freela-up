'use strict';

angular
  .module('AdvancedFiltersServiceModule', [
    'AdvancedFiltersQueryModalControllerModule',
    'AdvancedFiltersCategoryModalControllerModule',
    'AdvancedFiltersStatusModalControllerModule',
    'AdvancedFiltersAuthorModalControllerModule',
    'AdvancedFiltersReporterModalControllerModule',
    'AdvancedFiltersPeriodModalControllerModule',
    'AdvancedFiltersAreaModalControllerModule',
    'AdvancedFiltersFieldsModalControllerModule',
    'AdvancedFiltersShareModalControllerModule',
    'AdvancedFiltersNotificationMinimumNumberModalControllerModule',
    'AdvancedFiltersNotificationDeadlineModalControllerModule',
    'AdvancedFiltersNotificationOverdueModalControllerModule',
    'AdvancedFiltersNotificationSinceLastModalControllerModule',
    'ReportsCategoriesServiceModule',
    'InventoriesCategoriesServiceModule'
  ])

  /* This file contains common filters used by inventory/reports */
  .factory('AdvancedFilters', function ($modal, Restangular, $q, $location, $rootScope, ReportsCategoriesService, InventoriesCategoriesService) {
    var categoryResolver = function(type) {
      var list;

      if (type === 'items')
      {
        list = InventoriesCategoriesService.loadedBasicInfo ? _.values(InventoriesCategoriesService.categories) : InventoriesCategoriesService.fetchAllBasicInfo();
      }
      else
      {
        list = ReportsCategoriesService.loadedBasicInfo ? _.values(ReportsCategoriesService.categories) : ReportsCategoriesService.fetchAllBasicInfo();
      }

      return list;
    };

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
      category: function (activeAdvancedFilters, type) {
        $rootScope.resolvingRequest = true;

        $modal.open({
          templateUrl: 'modals/advanced-filters/category/advanced-filters-category.template.html',
          windowClass: 'filterCategoriesModal',
          resolve: {
            'categoriesResponse': function(){
              return categoryResolver(type);
            },

            activeAdvancedFilters: function() {
              return activeAdvancedFilters;
            }
          },
          controller: 'AdvancedFiltersCategoryModalController'
        });
      },

      // advanced filter by status
      status: function(activeAdvancedFilters, type) {
        $rootScope.resolvingRequest = true;

        $modal.open({
          templateUrl: 'modals/advanced-filters/status/advanced-filters-status.template.html',
          windowClass: 'filterStatusesModal',
          resolve: {
            'categoriesResponse': function() {
              return categoryResolver(type);
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

      // advanced filter by the report's original author
      reporter: function(activeAdvancedFilters) {
        $modal.open({
          templateUrl: 'modals/advanced-filters/reporter/advanced-filters-reporter.template.html',
          windowClass: 'filterAuthorModal',
          resolve: {
            activeAdvancedFilters: function() {
              return activeAdvancedFilters;
            }
          },
          controller: 'AdvancedFiltersReporterModalController'
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

      // advanced filter by minimum notification number
      notificationMinimumNumber: function(activeAdvancedFilters) {
        return $modal.open({
          templateUrl: 'modals/advanced-filters/notification/minimum-number/advanced-filters-notification-minimum-number.template.html',
          windowClass: 'filterNotificationMininumNumberModal',
          resolve: {
            activeAdvancedFilters: function() {
              return activeAdvancedFilters;
            }
          },
          controller: 'AdvancedFiltersNotificationMinimumNumberModalController'
        });
      },

      // advanced filter by days since last notification
      notificationSinceLast: function(activeAdvancedFilters) {
        return $modal.open({
          templateUrl: 'modals/advanced-filters/notification/since-last/advanced-filters-notification-since-last.template.html',
          windowClass: 'filterNotificationModal',
          resolve: {
            activeAdvancedFilters: function() {
              return activeAdvancedFilters;
            }
          },
          controller: 'AdvancedFiltersNotificationSinceLastModalController'
        });
      },

      // advanced filter by days for last notification deadline
      notificationDeadline: function(activeAdvancedFilters) {
        return $modal.open({
          templateUrl: 'modals/advanced-filters/notification/deadline/advanced-filters-notification-deadline.template.html',
          windowClass: 'filterNotificationModal',
          resolve: {
            activeAdvancedFilters: function() {
              return activeAdvancedFilters;
            }
          },
          controller: 'AdvancedFiltersNotificationDeadlineModalController'
        });
      },

      // advanced filter by days for overdue notification
      notificationOverdue: function(activeAdvancedFilters) {
        return $modal.open({
          templateUrl: 'modals/advanced-filters/notification/overdue/advanced-filters-notification-overdue.template.html',
          windowClass: 'filterNotificationModal',
          resolve: {
            activeAdvancedFilters: function() {
              return activeAdvancedFilters;
            }
          },
          controller: 'AdvancedFiltersNotificationOverdueModalController'
        });
      },

      fields: function(activeAdvancedFilters) {
        $rootScope.resolvingRequest = true;

        $modal.open({
          templateUrl: 'modals/advanced-filters/fields/advanced-filters-fields.template.html',
          windowClass: 'fieldsCategoriesModal',
          resolve: {
            'categoriesResponse': ['Restangular', function(Restangular) {
              return categoryResolver('items');
            }],

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
