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

        scope.changeDefaultState = function() {
          var putResolutionPromise = Restangular.one('flows', scope.flow.id).one('resolution_states', scope.state.id).customPUT({title: scope.state.title, default: scope.state.default});

          putResolutionPromise.then(function() {
            // yay :)
          });
        };

        scope.removeState = function() {
          var deleteResolutionPromise = Restangular.one('flows', scope.flow.id).one('resolution_states', scope.state.id).remove();

          deleteResolutionPromise.then(function() {
            scope.$parent.$parent.flow.resolution_states.splice(scope.$parent.$parent.flow.resolution_states.indexOf(scope.state), 1); // jshint ignore:line

            scope.showRemoveState = false;
          });
        };
      }
    };
  });
