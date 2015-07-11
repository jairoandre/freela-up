'use strict';

angular
  .module('BusinessReportsIndexListDirectiveModule', [])
  .directive('businessReportsIndexList', function(){
    return {
      restrict: 'E',
      scope: {
        loadContent: '&',
        showEditButton: '=',
        showRemoveButton: '='
      },
      templateUrl: 'routes/business-reports/index/components/list/business-reports-index-list.template.html',
      controller: function($scope, $window) {
        ($scope.loadContent())().then(function(reports){
          $scope.reports = reports;
          $scope.contentLoaded = true;
        }, function(){
          $scope.errorLoadingContent = true;
        });

        $scope.daysBetween = function(from, to) {
          return Math.ceil((to - from) / 1000 / 60 / 60 / 24);
        };

        $scope.reloadApplication = function(){
          $window.location.reload(true);
        };
      }
    };
  });
