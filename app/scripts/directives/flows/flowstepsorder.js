'use strict';

angular.module('zupPainelApp')
  .directive('flowStepsOrder', function (Restangular, $timeout) {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {
        var pendingNewInput = null;

        scope.updateFieldsOrder = function() {
          var ids = [], cancel = false;

          for (var i = scope.fields.length - 1; i >= 0; i--) {
            if (typeof scope.fields[i].id !== 'undefined')
            {
              ids[scope.fields[i].position] = scope.fields[i].id;
            }
          };

          // okay, before we update we need to make sure that every item in the list is with it's correct position :-)
          for (var i = ids.length - 1; i >= 0; i--) {
            if (typeof ids[i] === 'undefined')
            {
              cancel = true;
            }
          };

          if (!cancel)
          {
            Restangular.one('flows', scope.flow.id).one('steps', scope.step.id).all('fields').customPUT({ids: ids});
          }
        };

        var updateInputsPosition = function(stop) {
          element.find('.input').each(function() {
            $(this).scope().field.position = $(this).index();
          });

          scope.$apply();

          // update fields order
          if (stop === true)
          {
            scope.updateFieldsOrder();
          }
        };

        element.sortable({
          revert: true,
          handle: '.handle',
          forcePlaceholderSize: false,
          placeholder: {
            element: function() {
              return $('<tbody><tr><td colspan="3">Solte para ordenar</td></tr></tbody>');
            },

            update: function() {
              return;
            }
          },
          start: function(event, ui) {
            $(ui.helper).addClass('helper');

            //updateInputsPosition();
          },
          stop: function(event, ui) {
            $(ui.item).removeClass('helper');

            //updateInputsPosition(true);
          }
        });
      }
    };
  });
