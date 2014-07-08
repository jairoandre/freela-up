'use strict';

angular.module('zupPainelApp')
  .directive('flowDroppableInputsArea', function (Restangular, $timeout) {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {
        var pendingNewInput = null;

        var updateInputsPosition = function(stop) {
          element.find('.input').each(function() {
            console.log($(this).index(), this);
            $(this).scope().field.order_number = $(this).index();
          });

          scope.$apply();

          // update fields order
          if (stop === true)
          {
            var ids = [];

            for (var i = scope.fields.length - 1; i >= 0; i--) {
              if (typeof scope.fields[i].id === 'number')
              {
                ids[scope.fields[i].order_number] = scope.fields[i].id;
              }
            };

            Restangular.one('flows', scope.flow.id).one('steps', scope.step.id).all('fields').customPUT({ids: ids});
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
              order_number: null
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

              pendingNewInput.order_number = newElementPos;

              // find which element has the same position, and add 0.5 to it's position so the new element is rendered before the old one
              for (var i = scope.fields.length - 1; i >= 0; i--) {
                if (scope.fields[i].order_number === newElementPos)
                {
                  scope.fields[i].order_number = scope.fields[i].order_number + 0.5;
                }
              }

              // create the new input
              var fieldPromise = Restangular.one('flows', scope.flow.id).one('steps', scope.step.id).post('fields', pendingNewInput);

              fieldPromise.then(function(response) {
                pendingNewInput.id = response.data.id;

                scope.fields.push(pendingNewInput);

                $timeout(function() {
                  updateInputsPosition(true);
                });

                pendingNewInput = null;
              });
            }
          },
          start: function(event, ui) {
            $(ui.helper).addClass('helper');
          },
          stop: function(event, ui) {
            $(ui.item).removeClass('helper');

            updateInputsPosition(true);
          }
        });
      }
    };
  });
