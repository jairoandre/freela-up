'use strict';

angular.module('zupPainelApp')
  .directive('flowStepField', function (Restangular) {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {

        var update = function() {
          return Restangular.one('flows', scope.flow.id).one('steps', scope.step.id).one('fields', scope.field.id).customPUT(scope.field);
        };

        scope.saveTitle = function() {
          update().then(function() {
            scope.editingLabel = false;
          });
        };

        scope.removeField = function() {
          scope.field.remove().then(function() {
            scope.field.destroy = true;
          });
        };

      }
    };
  });
