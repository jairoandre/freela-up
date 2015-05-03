'use strict';

angular
  .module('ReportsShowPrintControllerModule', [
    'MapShowReportComponentModule'
  ])

  .controller('ReportsShowPrintController', function ($scope, $window, $document, $stateParams, reportResponse, feedbackResponse, commentsResponse, reportHistoryResponse) {
    $scope.report = reportResponse.data;
    $scope.report.status_id = $scope.report.status.id;
    $scope.feedback = feedbackResponse.data;
    $scope.comments = commentsResponse.data;

    var sections = $stateParams.sections.split(',');

    $scope.showSection = function(section) {
      return sections.indexOf(section) !== -1;
    };

    $scope.filterByUserMessages = function(comment) {
      return (comment.visibility === 0 || comment.visibility === 1);
    };

    $scope.historyLogs = reportHistoryResponse.data;

    var img = $scope.logoImg;

    $scope.blueLogoImg = img.substring(0, img.lastIndexOf('.')) + '-blue' + img.substring(img.lastIndexOf('.'));

    $scope.print = function() {
      $window.focus();
      $window.print();
    };
  });
