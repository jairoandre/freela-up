'use strict';

angular.module('zupPainelApp')
  .directive('editLabel', function ($timeout) {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {
        scope.editLabel = function() {
          scope.label = angular.copy(scope.field.label);
          scope.editingLabel = true;

          $timeout(function() {
            element.find('.editLabelField').focus();
          });
        };

        scope.saveLabel = function() {
          scope.field.label = scope.label;

          scope.editingLabel = false;
        };

        // detect "esc" key on input
        element.find('.editLabelField').keyup(function(e) {
          if (e.keyCode === 13)
          {
            scope.saveLabel();

            scope.$apply();
          };

          if (e.keyCode === 27)
          {
            scope.editingLabel = false;

            scope.$apply();
          };
        });
      }
    };
  });
