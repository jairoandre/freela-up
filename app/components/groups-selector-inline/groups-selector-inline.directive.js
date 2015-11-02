'use strict';

angular
  .module('GroupsSelectorInlineModule', [

  ])
  .directive('groupsSelectorInline', function (Restangular) {
    return {
      restrict: 'E',
      scope: {
        groups: '='
      },
      templateUrl: 'components/groups-selector-inline/groups-selector-inline.template.html',
      controllerAs: 'groupsSelectorCtrl',
      controller: function ($scope, $element) {
        $scope.groupsAutocomplete = {
          options: {
            position: { my: 'left top', at: "left bottom", of: $element.find(".groups-autocomplete") },
            onlySelect: true,
            source: function( request, uiResponse ) {
              var categoriesPromise = Restangular.all('search/groups').getList({ name: request.term, return_fields: 'id,name', like: true });

              categoriesPromise.then(function(response) {
                uiResponse( $.map( response.data, function( group ) {
                  return {
                    label: group.name,
                    value: group.name,
                    group: {id: group.id, name: group.name}
                  };
                }));
              });
            },
            messages: {
              noResults: '',
              results: angular.noop
            }
          }
        };

        $scope.groupsAutocomplete.events = {
          select: function( event, ui ) {
            if(!_.findWhere($scope.groups, { id: ui.item.group.id })) {
              $scope.groups.push(ui.item.group);
            }
          },

          change: function() {
            $scope.group = '';
          }
        };

        $scope.removeGroup = function(group){
          $scope.groups.splice($scope.groups.indexOf(group), 1);
        };
      }
    };
  });