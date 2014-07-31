'use strict';

angular.module('zupPainelApp')
  .directive('flowResolutionState', function (Restangular) {
    return {
      restrict: 'A',
      link: function postLink(scope) {
        scope.saveTitle = function() {
          var putResolutionPromise = Restangular.one('flows', scope.flow.id).one('resolution_states', scope.state.id).customPUT({title: scope.state.title});

          putResolutionPromise.then(function() {
            scope.editTitle = false;
          });
        };

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
