'use strict';

angular
  .module('BusinessReportsEditHeaderDirectiveModule', [])
  .directive('businessReportsEditHeader', function(){
    return {
      restrict: 'E',
      scope: {
        title: '=',
        report: '=',
        savePromise: '=',
        showEditButton: '=',
        showSaveButton: '=',
        enableSaveButton: '=',
        saveButtonClicked: '&'
      },
      templateUrl: 'routes/business-reports/edit/components/header/business-reports-edit-header.template.html'
    };
  });
