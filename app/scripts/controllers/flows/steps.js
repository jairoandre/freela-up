'use strict';

angular.module('zupPainelApp')

.controller('FlowsStepsCtrl', function ($scope, Restangular, $modal, $routeParams, $q) {
  $scope.currentTab = 'form';

  var flowId = $routeParams.flowId, stepId = $routeParams.id;

  $scope.loading = true;
  $scope.currentTab = 'form';

  var flowPromise = Restangular.one('flows', flowId).get();
  var stepPromise = Restangular.one('flows', flowId).one('steps', stepId).get();
  var fieldsPromise = Restangular.one('flows', flowId).one('steps', stepId).all('fields').getList();
  var triggersPromise = Restangular.one('flows', flowId).one('steps', stepId).all('triggers').getList();

  $q.all([flowPromise, stepPromise, fieldsPromise, triggersPromise]).then(function(responses) {
    $scope.loading = false;

    $scope.flow = responses[0].data;
    $scope.step = responses[1].data;
    $scope.fields = responses[2].data;
    $scope.triggers = responses[3].data;

    // debbuging :-D
    console.log(Restangular.stripRestangular($scope.flow));
    console.log(Restangular.stripRestangular($scope.step));
    console.log(Restangular.stripRestangular($scope.fields));
    console.log(Restangular.stripRestangular($scope.triggers));
  });

  // available fields
  $scope.availableInputs = {
    'normal': [
      {kind: 'text', name: 'Campo de texto'},
      {kind: 'integer', name: 'Campo numérico'},
      {kind: 'decimal', name: 'Campo decimal'},
      {kind: 'checkbox', name: 'Campo de múltipla escolha', multipleOptions: true},
      {kind: 'select', name: 'Campo de lista', multipleOptions: true},
      {kind: 'radio', name: 'Campo de escolha única', multipleOptions: true},
      {kind: 'meters', name: 'Campo em metros'},
      {kind: 'centimeters', name: 'Campo em centímetros'},
      {kind: 'kilometers', name: 'Campo em quilômetros'},
      {kind: 'years', name: 'Campo em anos'},
      {kind: 'months', name: 'Campo em meses'},
      {kind: 'days', name: 'Campo em dias'},
      {kind: 'hours', name: 'Campo em horas'},
      {kind: 'seconds', name: 'Campo em segundos'},
      {kind: 'angle', name: 'Campo de ângulo'},
      {kind: 'date', name: 'Campo de data'},
      {kind: 'time', name: 'Campo de tempo'},
      {kind: 'cpf', name: 'Campo de CPF'},
      {kind: 'cnpj', name: 'Campo de CNPJ'},
      {kind: 'url', name: 'Campo de URL'},
      {kind: 'email', name: 'Campo de e-mail'},
      {kind: 'image', name: 'Campo de imagem'},
      {kind: 'attachment', name: 'Campo de anexo'},
    ],

    'special': [
      {kind: 'previous_field', name: 'Etapa anterior'},
      {kind: 'category_inventory', name: 'Categoria de inventário'},
      {kind: 'category_inventory_field', name: 'Campo de inventário'},
      {kind: 'category_report', name: 'Categoria de relato'},
    ]
  };

  $scope.kindHasMultipleOptions = function(kind) {
    for (var i = $scope.availableInputs.normal.length - 1; i >= 0; i--) {
      if ($scope.availableInputs.normal[i].kind === kind)
      {
        return $scope.availableInputs.normal[i].multipleOptions === true;
      }
    }

    return false;
  };

  $scope.$on('hidePopovers', function(event, data) {
    // tell each popover to close before opening a new one
    $scope.$broadcast('hideOpenPopovers', data);
  });

  $scope.editStep = function () {
    $modal.open({
      templateUrl: 'views/flows/steps/editBasic.html',
      windowClass: 'editStepModal',
      resolve: {
        flow: function() {
          return $scope.flow;
        },

        step: function() {
          return $scope.step;
        }
      },
      controller: ['$scope', '$modalInstance', 'flow', 'step', function($scope, $modalInstance, flow, step) {
        $scope.step = angular.copy(step);

        $scope.save = function()
        {
          var putStepPromise = Restangular.one('flows', flow.id).one('steps', step.id).customPUT({title: $scope.step.title});

          putStepPromise.then(function() {
            step.title = $scope.step.title;

            $modalInstance.close();
          });
        };

        $scope.close = function() {
          $modalInstance.close();
        };
      }]
    });
  };
});
