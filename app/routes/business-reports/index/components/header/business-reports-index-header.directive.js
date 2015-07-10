'use strict';

angular
  .module('BusinessReportsIndexHeaderDirectiveModule', [])
  .directive('businessReportsIndexHeaderDirective', function(){
    return {
      restrict: 'E',
      scope: {
        showAddNewButton: '='
      },
      templateUrl: 'routes/business-reports/index/components/header/business-reports-index-header.html'
    };
  });
