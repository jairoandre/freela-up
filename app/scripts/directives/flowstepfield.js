'use strict';

angular.module('zupPainelApp')
  .directive('flowStepField', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {

        scope.saveTitle = function() {
          var putFieldPromise = Restangular.one('flows', scope.flow.id).one('steps', scope.step.id).one('fields', scope.field.id).customPUT({title: scope.field.title});

          putFieldPromise.then(function() {
            scope.editingLabel = false;
          });
        };

      }
    };
  });
