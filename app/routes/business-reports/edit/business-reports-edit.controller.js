'use strict';

angular
  .module('BusinessReportsEditControllerModule', [
    'BusinessReportsEditHeaderDirectiveModule',
    'BusinessReportsEditFormDirectiveModule',
    'BusinessReportsEditChartsDirectiveModule',
    'BusinessReportsServiceModule',
    'GroupSelectorModule',
    'AngularPrint'
  ])
  .controller('BusinessReportsEditController', function (ENV, Auth, $state, $scope, BusinessReportsService, $stateParams, $window, editable, GroupSelectorService) {
    $scope.reportLoaded = false;
    $scope.editable = editable;

    // Load report
    if($stateParams.reportId) {
      BusinessReportsService.find($stateParams.reportId).then(function (report) {
        $scope.report = report;
        $scope.reportLoaded = true;
      }, function () {
        $scope.showMessage('exclamation-sign', ' Não foi possível carregar o relatório requisitado. Por favor, tente novamente em alguns minutos.', 'error', true);
        $state.go('business_reports.list');
      });
    } else {
      $scope.report = { charts: [] };
      $scope.reportLoaded = true;
    }

    // Enable/disable save button
    var updateValidity = function(){
      $scope.valid = $scope.reportLoaded && BusinessReportsService.isValid($scope.report);
    };
    $scope.$watch('report.title', updateValidity);
    $scope.$watch('report.charts', updateValidity, true);

    // Save
    $scope.saveBusinessReport = function(){
      $scope.savePromise = BusinessReportsService.save($scope.report);
      $scope.savePromise.then(function(report){
        $scope.report = report;
        $scope.showMessage('ok', 'O Relatório ' + $scope.report.title + ' foi salvo com sucesso', 'success', true);
        $state.go('business_reports.show', { reportId: $scope.report.id });
      }, function(){
        $scope.showMessage('exclamation-sign', ' Não foi possível salvar o relatório ' + $scope.report.title + '. Por favor, tente novamente em alguns minutos.', 'error', true);
      });
    };

    // Export to XLS
    $scope.exportToXLS = function(){
      $window.location = ENV.apiEndpoint + '/business_reports/' + $scope.report.id + '/export/xls?token=' + Auth.getToken();
    };
  });
