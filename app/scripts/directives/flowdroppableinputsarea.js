'use strict';

angular.module('zupPainelApp')
  .directive('flowDroppableInputsArea', function (Restangular) {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {
        var pendingNewInput = null;

        var updateInputsPosition = function(stop) {
          element.find('.input').each(function() {
            $(this).scope().field.step_order = $(this).index();
          });

          // update fields order
          if (stop === true)
          {
            var ids = [];

            for (var i = scope.fields.length - 1; i >= 0; i--) {
              ids[scope.fields[i].step_order - 1] = scope.fields[i].id;
            };

            Restangular.one('flows', scope.flow.id).one('steps', scope.step.id).all('fields').customPUT({ids: ids});
          }

          scope.$apply();
        };

        element.sortable({
          revert: true,
          handle: '.handle',
          forcePlaceholderSize: false,
          placeholder: {
            element: function() {
              return $('<div class="customSortablePlaceholder"><p>Solte para adicionar</p></div>');
            },

            update: function() {
              return;
            }
          },
          receive: function(event, ui) {
            var inputType = ui.item.attr('name');

            var newInput = {
              field_type: inputType,
              title: 'Novo ' + inputType,
              maximum: null,
              minimum: null,
              presence: false,
              position: null
            };

            pendingNewInput = newInput;
          },
          update: function(event, ui) {
            var newElementPos = $(ui.item).index();

            if (pendingNewInput !== null)
            {
              // no need to have a new element added to the DOM, angular will do automatically with ng-repeat
              $(this).find('.item').remove();

              pendingNewInput.position = newElementPos;

              // find which element has the same position, and add 0.5 to it's position so the new element is rendered before the old one
              for (var i = scope.fields.length - 1; i >= 0; i--) {
                if (scope.fields[i].position === newElementPos)
                {
                  scope.fields[i].position = scope.fields[i].position + 0.5;
                }
              }

              // create the new input
              var fieldPromise = Restangular.one('flows', scope.flow.id).one('steps', scope.step.id).post('fields', pendingNewInput);

              fieldPromise.then(function() {
                scope.fields.push(pendingNewInput);

                pendingNewInput = null;
              });
            }
          },
          start: function(event, ui) {
            $(ui.helper).addClass('helper');

            updateInputsPosition();
          },
          stop: function(event, ui) {
            $(ui.item).removeClass('helper');

            updateInputsPosition(true);
          }
        });
      }
    };
  });
