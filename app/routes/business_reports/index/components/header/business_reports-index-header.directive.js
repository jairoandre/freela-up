'user strict';

angular
  .module('BusinessReportsIndexHeaderDirectiveModule', [])
  .directive('businessReportsIndexHeaderDirective', function(){
    return {
      restrict: 'E',
      scope: {
        showAddNewButton: '='
      },
      templateUrl: 'routes/business_reports/index/components/header/business_reports-index-header.html'
    };
  });
