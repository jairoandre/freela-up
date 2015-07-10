'use strict';

angular
  .module('BusinessReportsIndexListDirectiveModule', [])
  .directive('businessReportsListHeaderDirective', function(){
    return {
      restrict: 'E',
      scope: {
        contentLoaded: false,
        reports: []
      },
      templateUrl: 'routes/business-reports/index/components/header/business-reports-index-list.html',
      controller: function($scope, el) {

      }
    };
  });
