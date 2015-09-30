'use strict';

angular
  .module('ReportsShowPrintControllerModule', [
    'MapShowReportComponentModule'
  ])

  .controller('ReportsShowPrintController', function ($scope, $window, $timeout, $document, $stateParams, reportResponse, feedbackResponse, commentsResponse, reportHistoryResponse) {
    $scope.report = reportResponse.data;
    $scope.report.status_id = $scope.report.status.id;
    $scope.feedback = feedbackResponse.data;
    $scope.comments = commentsResponse.data;

    var sections = $stateParams.sections.split(',');

    $scope.showSection = function (section) {
      return sections.indexOf(section) !== -1;
    };

    $scope.filterByUserMessages = function (comment) {
      return (comment.visibility === 0 || comment.visibility === 1);
    };

    $scope.historyLogs = reportHistoryResponse.data;

    $scope.print = function () {

      var document = $window.document;
      var printSection = document.getElementById('printSection');

      var printSection = document.createElement('div');
      printSection.id = 'printSection';
      document.body.appendChild(printSection);

      var divToPrint = document.getElementById('printContent');

      var cloneDiv = divToPrint.cloneNode(true);
      printSection.appendChild(cloneDiv);

      $window.print();

    };
  });
