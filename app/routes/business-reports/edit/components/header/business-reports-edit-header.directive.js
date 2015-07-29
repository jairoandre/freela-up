'use strict';

angular
  .module('BusinessReportsEditHeaderDirectiveModule', [])
  .directive('businessReportsEditHeader', function(){
    return {
      restrict: 'E',
      scope: {
        report: '=',
        savePromise: '=',
        showPrintButton: '=',
        showXlsButton: '=',
        showEditButton: '=',
        showSaveButton: '=',
        enableSaveButton: '=',
        saveButtonClicked: '&',
        xlsButtonClicked: '&'
      },
      templateUrl: 'routes/business-reports/edit/components/header/business-reports-edit-header.template.html'
    };
  });
