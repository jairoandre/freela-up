'use strict';

angular.module('zupPainelApp')
  .directive('flowStepField', function (Restangular) {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {

        if (typeof scope.field.id !== 'undefined')
        {
          scope.field.position = scope.field.order_number - 1;
        }
        else
        {
          scope.savingField = true;

          // field needs to be created!
          var fieldPromise = Restangular.one('flows', scope.flow.id).one('steps', scope.step.id).post('fields', scope.field);

          fieldPromise.then(function(response) {
            scope.field.id = response.data.id;

            // enable the field again
            scope.savingField = false;

            // update the order...again :P
            scope.updateFieldsOrder();
          });
        }

        var update = function() {
          return Restangular.one('flows', scope.flow.id).one('steps', scope.step.id).one('fields', scope.field.id).customPUT(scope.field);
        };

        scope.saveTitle = function() {
          update();

          scope.editingLabel = false;
        };

        scope.saveField = function() {
          update();

          scope.popover.options = false;
        };

        scope.removeField = function() {
          scope.field.remove();

          scope.field.destroy = true;
        };

      }
    };
  });
