'use strict';

angular
  .module('BusinessReportsEditFormDirectiveModule', ['angularInlineEdit', 'PeriodSelectorModule'])
  .directive('businessReportsEditForm', function(PeriodSelectorService){
    return {
      restrict: 'E',
      scope: {
        editable: '=',
        report: '=',
        valid: '='
      },
      templateUrl: 'routes/business-reports/edit/components/form/business-reports-edit-form.template.html',
      controller: function($scope) {
        $scope.openPeriodSelector = function(){
          PeriodSelectorService.open(false).then(function(period){
            $scope.report.begin_date = period.beginDate;
            $scope.report.end_date = period.endDate;
          });
        };

        $scope.hasDefaultPeriodSelected = function(){
          return $scope.report.begin_date && $scope.report.end_date;
        };

        $scope.clearDefaultPeriod = function() {
          $scope.report.begin_date = null;
          $scope.report.end_date = null;
        }
      }
    };
  });
