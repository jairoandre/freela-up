'use strict';

angular
  .module('ReportsPerimetersIndexControllerModule', [
    'angularInlineEdit',
    'ReportsPerimetersServiceModule',
    'ReportsPerimetersModalControllerModule'
  ])

  .controller('ReportsPerimetersIndexController', function ($scope, $rootScope, $log, ReportsPerimetersService, $modal) {

    $log.info('ReportsPerimetersIndexController created.');
    $scope.$on('$destroy', function () {
      $log.info('ReportsPerimetersIndexController destroyed.');
    });


    var service = ReportsPerimetersService;

    $scope.loading = true;

    $scope.statusDecorator = {
      pendent: ['time', 'perimeter-status-process', 'EM PROCESSAMENTO'],
      imported: ['ok', 'perimeter-status-ok', 'CADASTRADO COM SUCESSO'],
      invalid_file: ['warning-sign', 'perimeter-status-error', 'ERRO: ARQUIVO INVÁLIDO'],
      out_of_bounds: ['warning-sign', 'perimeter-status-error', 'ERRO: FORA DO PERÍMETRO DA CIDADE'],
      invalid_quantity: ['warning-sign', 'perimeter-status-error', 'ERRO: QUANTIDADE INVÁLIDA'],
      invalid_geometry: ['warning-sign', 'perimeter-status-error', 'ERRO: FORMA GEOMÉTRICA INVÁLIDA']
    };

    $scope.perimeters = [];

    var loadPerimeters = $scope.loadPerimeters = function () {
      $scope.loading = true;
      service.listAll().then(function (r) {
        $scope.perimeters = r;
        $scope.loading = false;
      });
    }

    loadPerimeters();

    $scope.updatePerimeter = function (perimeter, newValue) {
      perimeter.title = newValue;
      service.updatePerimeter(perimeter).then(function () {
        $log.info('Updated title');
      });
    };

    $scope.addPerimeter = function () {
      $modal.open({
        templateUrl: 'modals/reports/perimeters/reports-perimeters-modal.template.html',
        backdrop: false,
        resolve: {
          parentScope: function () {
            return $scope;
          }
        },
        controller: 'ReportsPerimetersModalController'
      });
    };

    $scope.deletePerimeter = function (perimeter) {
      $scope.deletePromise = service.deletePerimeter(perimeter).then(function () {
        loadPerimeters();
        $rootScope.showMessage('ok', 'Perímetro removido com sucesso.', 'success', true);
        $scope.deletePromise = undefined;
      });
    }

  });
