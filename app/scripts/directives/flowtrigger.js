'use strict';

angular.module('zupPainelApp')
  .directive('flowTrigger', function (Restangular) {
    return {
      restrict: 'A',
      link: function postLink(scope) {

        if (scope.trigger.isNew === true)
        {
          scope.editing = true;
        }

        scope.types = [
          {id: '==', name: 'Igual'},
          {id: '!=', name: 'Diferente'},
          {id: '>', name: 'Maior'},
          {id: '<', name: 'Menor'},
          {id: 'inc', name: 'Entre valores'},
        ];

        scope.newCondition = function() {
          scope.trigger.trigger_conditions.push({field: {}, condition_type: '==', values: []}); // jshint ignore:line
        };

        scope.saveTrigger = function() {

          var conditions = [];

          for (var i = scope.trigger.trigger_conditions.length - 1; i >= 0; i--) {
            conditions.push({field_id: scope.trigger.trigger_conditions[i].field.id, condition_type: scope.trigger.trigger_conditions[i].condition_type, values: scope.trigger.trigger_conditions[i].values});
          };

          var trigger = {
            title: scope.trigger.title,
            trigger_conditions_attributes: conditions,
            action_type: scope.trigger.action_type,
            action_values: scope.trigger.action_values,
            description: scope.trigger.description
          };

          // helpers
          var updateTriggerPromise, stepContainer = Restangular.one('flows', scope.$parent.flow.id).one('steps', scope.$parent.step.id);

          if (scope.trigger.isNew === true)
          {

            updateTriggerPromise = stepContainer.post('triggers', trigger);
          }
          else
          {
            updateTriggerPromise = stepContainer.one('triggers', scope.trigger.id).customPUT(trigger);
          }
        };

      }
    };
  });
