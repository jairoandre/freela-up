'use strict';

angular
  .module('ReportsPerimetersIndexControllerModule', [
    'angularInlineEdit',
    'ReportsPerimetersServiceModule',
    'ReportsPerimetersModalControllerModule',
    'angular-toArrayFilter'
  ])

  .controller('ReportsPerimetersIndexController', function ($scope, $rootScope, $log, ReportsPerimetersService, $modal) {

    $log.debug('ReportsPerimetersIndexController created.');
    $scope.$on('$destroy', function () {
      $log.debug('ReportsPerimetersIndexController destroyed.');
    });


    var service = ReportsPerimetersService;

    $scope.loading = false;

    $scope.loadingPerimeter = {};

    $scope.statusDecorator = {
      pendent: ['time', 'perimeter-status-process', 'EM PROCESSAMENTO'],
      imported: ['ok', 'perimeter-status-ok', 'CADASTRADO COM SUCESSO'],
      invalid_file: ['warning-sign', 'perimeter-status-error', 'ERRO: ARQUIVO INVÁLIDO'],
      out_of_bounds: ['warning-sign', 'perimeter-status-error', 'ERRO: FORA DO PERÍMETRO DA CIDADE'],
      invalid_quantity: ['warning-sign', 'perimeter-status-error', 'ERRO: QUANTIDADE INVÁLIDA'],
      invalid_geometry: ['warning-sign', 'perimeter-status-error', 'ERRO: FORMA GEOMÉTRICA INVÁLIDA']
    };

    $scope.perimeters = [];

    $scope.cleanCache = function () {
      page = 1;
      perPage = 15;
      service.cleanCache();
    }

    $scope.sort = {
      'column': 'created_at',
      'descending': false
    };

    var page = 1, perPage = 15;

    var getData = $scope.getData = function () {
      if ($scope.loading === false) {
        $scope.loading = true;

        var options = {};

        if ($scope.sort.column !== '') {
          options.sort = $scope.sort.column;
          options.order = $scope.sort.descending ? 'desc' : 'asc';
        }

        options.page = +page || 1;
        options.per_page = +perPage || 15;

        var promise = service.fetchAll(options);

        promise.then(function (perimeters) {
          page++;
          $scope.perimeters = perimeters;

          var lastPage = Math.ceil($scope.total / perPage);

          if (page === (lastPage + 1)) {
            $scope.loading = null;
          } else {
            $scope.loading = false;
          }

          $scope.loading = false;
        });

        return promise;
      }
    };

    $scope.$on('perimetersFetched', function () {
      $scope.total = service.total;
      $scope.loading = false;
    });

    getData();

    $scope.updatePerimeter = function (perimeter, newValue) {
      perimeter.title = newValue;
      $scope.loadingPerimeter[perimeter.id] = true;
      service.updatePerimeter(perimeter).then(function () {
        $scope.loadingPerimeter[perimeter.id] = false;
        $rootScope.showMessage('ok','Nome do perímetro atualizado com sucesso.','success',true);
        $log.debug('Updated title');
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
