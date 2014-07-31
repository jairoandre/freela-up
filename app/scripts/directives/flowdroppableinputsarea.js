'use strict';

angular.module('zupPainelApp')
  .directive('flowDroppableInputsArea', function (Restangular, $timeout) {
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

            if (scope.kindHasMultipleOptions(inputType) === true)
            {
              newInput.values = {0: 'Novo item'};
            }

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

              scope.fields.push(pendingNewInput);

              scope.$apply();

              pendingNewInput = null;
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
