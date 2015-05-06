angular
  .module('ReportsCategoriesIndexModule', [
    'ReportsCategoriesIndexControllerModule',
    'ReportsCategoriesServiceModule'
  ])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('reports.categories', {
      url: '/categories',

      views: {
        '': {
          templateUrl: 'routes/reports/categories/index/reports-categories-index.template.html',
          controller: 'ReportsCategoriesIndexController',
          controllerAs: 'ctrl',
          resolve: {
            'categories': ['ReportsCategoriesService', '$q', function(ReportsCategoriesService, $q) {
              var fetchAllBasicInfo = function() {
                var deferred = $q.defer();

                ReportsCategoriesService.fetchAllBasicInfo().then(function(response) {
                  deferred.resolve(response.data.categories);
                });

                return deferred.promise;
              };

              return ReportsCategoriesService.loadedBasicInfo ? _.values(ReportsCategoriesService.categories) : fetchAllBasicInfo();
            }]
          }
        }
      }
    });

  }]);
