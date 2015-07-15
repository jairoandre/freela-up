'use strict';

angular
  .module('BusinessReportsEditHeaderDirectiveModule', [])
  .directive('businessReportsEditHeader', function(){
    return {
      restrict: 'E',
      scope: {
        title: '=',
        showSaveButton: '=',
        enableSaveButton: '=',
        saveButtonClicked: '&'
      },
      templateUrl: 'routes/business-reports/edit/components/header/business-reports-edit-header.template.html'
    };
  });
