'use strict';

angular
  .module('BusinessReportsEditHeaderDirectiveModule', [])
  .directive('businessReportsEditHeader', function(){
    return {
      restrict: 'E',
      scope: {
        report: '=',
        savePromise: '=',
        showShareButton: '=',
        showEditButton: '=',
        showSaveButton: '=',
        enableSaveButton: '=',
        saveButtonClicked: '&',
        shareButtonClicked: '&'
      },
      templateUrl: 'routes/business-reports/edit/components/header/business-reports-edit-header.template.html'
    };
  });
