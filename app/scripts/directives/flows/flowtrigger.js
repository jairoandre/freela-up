'use strict';

angular.module('zupPainelApp')
  .directive('flowTrigger', function (Restangular) {
    return {
      restrict: 'A',
      link: function postLink(scope) {

        // let's open the options section as soon as the user creates a new trigger
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

        scope.removeTrigger = function() {
          if (scope.trigger.isNew !== true)
          {
            scope.processingForm = true;

            var deletePromise = Restangular.one('flows', scope.$parent.flow.id).one('steps', scope.$parent.step.id).one('triggers', scope.trigger.id).remove();

            deletePromise.then(function() {
              scope.$parent.triggers.splice(scope.$parent.triggers.indexOf(scope.trigger), 1);
              scope.processingForm = false;
            });
          }
          else
          {
            scope.$parent.triggers.splice(scope.$parent.triggers.indexOf(scope.trigger), 1);
          }
        };

        scope.newCondition = function() {
          scope.trigger.trigger_conditions.push({field: {}, condition_type: '==', values: []}); // jshint ignore:line
        };

        scope.removeCondition = function(condition) {
          // if we have the condition id, we need to delete from the API
          if (typeof condition.id === 'number')
          {
            scope.processingForm = true;

            var deletePromise = Restangular.one('flows', scope.$parent.flow.id).one('steps', scope.$parent.step.id).one('triggers', scope.trigger.id).one('trigger_conditions', condition.id).remove();

            deletePromise.then(function() {
              scope.trigger.trigger_conditions.splice(scope.trigger.trigger_conditions.indexOf(condition), 1);
              scope.processingForm = false;
            });
          }
          else
          {
            scope.trigger.trigger_conditions.splice(scope.trigger.trigger_conditions.indexOf(condition), 1);
          }
        };

        scope.saveTrigger = function() {
          scope.processingForm = true;

          var conditions = [];

          // let's make our array API-friendly
          for (var i = scope.trigger.trigger_conditions.length - 1; i >= 0; i--) {
            var transformedCondition = {
              field_id: scope.trigger.trigger_conditions[i].field.id,
              condition_type: scope.trigger.trigger_conditions[i].condition_type,
              values: scope.trigger.trigger_conditions[i].values
            };

            if (typeof scope.trigger.trigger_conditions[i].id !== 'undefined')
            {
              transformedCondition.id = scope.trigger.trigger_conditions[i].id;
            }

            conditions.push(transformedCondition);
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

          updateTriggerPromise.then(function() {
            scope.showMessage('ok', 'O gatilho foi atualizado com sucesso!', 'success');
            scope.processingForm = false;
          });
        };

      }
    };
  });
