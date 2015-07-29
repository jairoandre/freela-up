'use strict';

angular
  .module('AdvancedFiltersServiceModule', [
    'AdvancedFiltersQueryModalControllerModule',
    'AdvancedFiltersCategoryModalControllerModule',
    'AdvancedFiltersStatusModalControllerModule',
    'AdvancedFiltersAuthorModalControllerModule',
    'AdvancedFiltersReporterModalControllerModule',
    'PeriodSelectorModule',
    'AdvancedFiltersAreaModalControllerModule',
    'AdvancedFiltersFieldsModalControllerModule',
    'AdvancedFiltersShareModalControllerModule',
    'ReportsCategoriesServiceModule',
    'InventoriesCategoriesServiceModule'
  ])

  /* This file contains common filters used by inventory/reports */
  .factory('AdvancedFilters', function ($modal, PeriodSelectorService, Restangular, $q, $location, $rootScope, ReportsCategoriesService, InventoriesCategoriesService) {
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
        PeriodSelectorService.open(true).then(function(period){
          if(period.beginDate) {
            var beginDateFilter = {
              title: 'A partir da data',
              type: 'beginDate',
              desc: moment(period.beginDate).format('DD/MM/YYYY'),
              value: moment(period.beginDate).startOf('day').format()
            };

            activeAdvancedFilters.push(beginDateFilter);
          }

          if(period.endDate) {
            var endDateFilter = {
              title: 'Até a data',
              type: 'endDate',
              desc: moment(period.endDate).format('DD/MM/YYYY'),
              value: moment(period.endDate).endOf('day').format()
            };

            activeAdvancedFilters.push(endDateFilter);
          }
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
