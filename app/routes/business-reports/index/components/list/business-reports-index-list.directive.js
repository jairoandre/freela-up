'use strict';

angular
  .module('BusinessReportsIndexListDirectiveModule', ['BusinessReportsDestroyModalModule', 'BusinessReportsServiceModule'])
  .directive('businessReportsIndexList', function($state, BusinessReportsService, $rootScope, BusinessReportDestroyModalService){
    return {
      restrict: 'E',
      scope: {
        loadContent: '&',
        showEditButton: '=',
        showRemoveButton: '='
      },
      templateUrl: 'routes/business-reports/index/components/list/business-reports-index-list.template.html',
      controller: function($scope, $window) {
        $scope.loadContent().then(function(reports){
          $scope.reports = reports;
          $scope.contentLoaded = true;
        }, function(){
          $scope.errorLoadingContent = true;
        });

        var removeReportFromList = function(report){
          $scope.reports.splice($scope.reports.indexOf(report), 1);
        };

        $scope.deleteReport = function (report) {
          BusinessReportDestroyModalService.open(report).then(removeReportFromList);
        };

        $scope.daysBetween = function(from, to) {
          return Math.ceil((to - from) / 1000 / 60 / 60 / 24);
        };

        $scope.reloadApplication = function(){
          $window.location.reload(true);
        };

        $scope.openBusinessReport = function(id, event) {
          if(!$rootScope.loading
            && event.target.parentNode.tagName.toLowerCase() != 'a'
            && event.target.tagName.toLowerCase() != 'a'
          ) {
            $state.go('business_reports.show', { reportId: id });
          }
        };

        $scope.duplicateReport = function(report) {
          if($rootScope.loading) return;
          $rootScope.loading = true;
          BusinessReportsService.find(report.id).then(function(report){
            delete report.id;
            report.title += ' - cópia';
            _.each(report.charts, function(c) { delete c.id; } );
            BusinessReportsService.save(report).then(function(){
              $rootScope.showMessage('ok', 'Relato duplicado com sucesso!', 'success', true);
              $rootScope.loading = false;
              $state.transitionTo($state.current, {}, {
                reload: true,
                inherit: false,
                notify: true
              });
            });
          });

        }
      }
    };
  });
