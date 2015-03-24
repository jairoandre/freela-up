'use strict';

angular
  .module('FlowsShowStepsEditControllerModule', [
    'FlowsStepsEditModalControllerModule',

    'FlowsCreateValueComponentModule',
    'FlowsDroppableInputsAreaComponentModule',
    'FlowsSingleValueComponentModule',
    'FlowsStepFieldComponentModule',
    'FlowsTriggerComponentModule',
    'InventoryPopoverComponentModule',
    'InventoryPopoverLinkComponentModule',
    'InputsSidebarComponentModule',
    'FlowsDraggableInputComponentModule'
  ])

  .controller('FlowsShowStepsEditController', function ($scope, Restangular, $modal, $stateParams, $q) {
    var flowId = $stateParams.id, stepId = $stateParams.stepId;

    $scope.loading = true;
    $scope.currentTab = 'form';

    var flowPromise = Restangular.one('flows', flowId).get({'display_type': 'full', 'return_fields': [
      'id', 'title', 'draft', 'initial', 'status'
    ].join()});
    var stepPromise = Restangular.one('flows', flowId).one('steps', stepId).get();
    var fieldsPromise = Restangular.one('flows', flowId).one('steps', stepId).all('fields').getList();
    var triggersPromise = Restangular.one('flows', flowId).one('steps', stepId).all('triggers').getList();
    var flowsPromise = Restangular.all('flows').getList({'display_type': 'full', 'return_fields': [
      'id', 'title'
    ].join()});

    $q.all([flowPromise, stepPromise, fieldsPromise, triggersPromise, flowsPromise]).then(function(responses) {
      $scope.loading = false;

      $scope.flow = responses[0].data;
      $scope.step = responses[1].data;
      $scope.fields = responses[2].data;
      $scope.triggers = responses[3].data;
      $scope.flows = responses[4].data;

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
        {kind: 'meter', name: 'Campo em metros'},
        {kind: 'centimeter', name: 'Campo em centímetros'},
        {kind: 'kilometer', name: 'Campo em quilômetros'},
        {kind: 'year', name: 'Campo em anos'},
        {kind: 'month', name: 'Campo em meses'},
        {kind: 'day', name: 'Campo em dias'},
        {kind: 'hour', name: 'Campo em horas'},
        {kind: 'minute', name: 'Campo em minutos'},
        {kind: 'second', name: 'Campo em segundos'},
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

    // Triggers helpers
    $scope.action_types = [ // jshint ignore:line
      {action: 'enable_steps', name: 'Ativar etapa(s)'},
      {action: 'disable_steps', name: 'Desativar etapa(s)'},
      {action: 'finish_flow', name: 'Finalizar fluxo(s)'},
      {action: 'transfer_flow', name: 'Transferir fluxo(s)'},
    ];

    $scope.newTrigger = function() {
      var newTrigger = {
        title: 'Novo gatilho',
        trigger_conditions: [], // jshint ignore:line
        action_type: 'disable_steps', // jshint ignore:line
        action_values: [], // jshint ignore:line
        description: '',
        isNew: true
      };

      $scope.triggers.push(newTrigger);
    };

    $scope.$on('hidePopovers', function(event, data) {
      // tell each popover to close before opening a new one
      $scope.$broadcast('hideOpenPopovers', data);
    });

    $scope.editStep = function () {
      $modal.open({
        templateUrl: 'modals/flows/steps/edit/flows-steps-edit.template.html',
        windowClass: 'editStepModal',
        resolve: {
          flow: function() {
            return $scope.flow;
          },

          step: function() {
            return $scope.step;
          }
        },
        controller: 'FlowsStepsEditModalController'
      });
    };
  });
