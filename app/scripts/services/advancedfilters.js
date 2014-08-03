'use strict';

angular.module('zupPainelApp')

/* This file contains common filters used by inventory/reports */
.factory('AdvancedFilters', function ($modal, Restangular, $q, $location) {
  return {
    // advanced filter by category
    query: function (activeAdvancedFilters) {
      $modal.open({
        templateUrl: 'views/filters/query.html',
        windowClass: 'filterQueryModal',
        resolve: {
          activeAdvancedFilters: function() {
            return activeAdvancedFilters;
          }
        },
        controller: ['$scope', '$modalInstance', 'activeAdvancedFilters', function($scope, $modalInstance, activeAdvancedFilters) {

          $scope.input = {};

          $scope.save = function() {
            var filter = {
              title: 'Título ou endereço',
              desc: $scope.input.query,
              type: 'query',
              value: $scope.input.query
            };

            activeAdvancedFilters.push(filter);

            $modalInstance.close();
          };

          $scope.close = function() {
            $modalInstance.close();
          };
        }]
      });
    },

    // advanced filter by category
    category: function (categories, activeAdvancedFilters) {
      $modal.open({
        templateUrl: 'views/filters/category.html',
        windowClass: 'filterCategoriesModal',
        resolve: {
          categories: function() {
            return categories;
          },

          activeAdvancedFilters: function() {
            return activeAdvancedFilters;
          }
        },
        controller: ['$scope', '$modalInstance', 'categories', 'activeAdvancedFilters', function($scope, $modalInstance, categories, activeAdvancedFilters) {
          $scope.categories = categories;
          $scope.activeAdvancedFilters = activeAdvancedFilters;

          $scope.updateCategory = function(category) {
            var i = $scope.categories.indexOf(category);

            if ($scope.categories[i].selected === true)
            {
              $scope.categories[i].selected = false;
            }
            else
            {
              $scope.categories[i].selected = true;
            }
          };

          $scope.save = function() {
            for (var i = $scope.categories.length - 1; i >= 0; i--) {
              if ($scope.categories[i].selected === true)
              {
                var filter = {
                  title: 'Categoria',
                  type: 'categories',
                  desc: $scope.categories[i].title,
                  value: $scope.categories[i].id
                };

                $scope.activeAdvancedFilters.push(filter);
              }
            }

            $modalInstance.close();
          };

          $scope.close = function() {
            $modalInstance.close();
          };
        }]
      });
    },

    // advanced filter by status
    status: function(categories, statuses, activeAdvancedFilters) {
      $modal.open({
        templateUrl: 'views/filters/status.html',
        windowClass: 'filterStatusesModal',
        resolve: {
          categories: function() {
            return categories;
          },

          statuses: function() {
            return statuses;
          },

          activeAdvancedFilters: function() {
            return activeAdvancedFilters;
          }
        },
        controller: ['$scope', '$modalInstance', 'categories', 'statuses', 'activeAdvancedFilters', function($scope, $modalInstance, categories, statuses, activeAdvancedFilters) {
          $scope.categories = categories;
          $scope.statuses = statuses;

          $scope.updateStatus = function(status) {
            if (typeof status.selected === 'undefined' || status.selected === false)
            {
              status.selected = true;
            }
            else
            {
              status.selected = false;
            }
          };

          $scope.save = function() {
            var statuses = {};

            for (var i = $scope.categories.length - 1; i >= 0; i--) {
              for (var j = $scope.categories[i].statuses.length - 1; j >= 0; j--) {
                if ($scope.categories[i].statuses[j].selected === true)
                {
                  statuses[$scope.categories[i].statuses[j].id] = $scope.categories[i].statuses[j];
                }
              };
            }

            for (var x in statuses)
            {
              var filter = {
                title: 'Estado',
                type: 'statuses',
                desc: statuses[x].title,
                value: statuses[x].id
              };

              activeAdvancedFilters.push(filter);
            }

            $modalInstance.close();
          };

          $scope.close = function() {
            $modalInstance.close();
          }; // hello
        }]
      });
    },

    // advanced filter by the author of the item
    author: function(activeAdvancedFilters) {
      $modal.open({
        templateUrl: 'views/filters/author.html',
        windowClass: 'filterAuthorModal',
        resolve: {
          activeAdvancedFilters: function() {
            return activeAdvancedFilters;
          }
        },
        controller: ['$scope', '$modalInstance', 'activeAdvancedFilters', function($scope, $modalInstance, activeAdvancedFilters) {
          $scope.activeAdvancedFilters = activeAdvancedFilters;
          $scope.users = [];
          $scope.field = {};

          $scope.usersAutocomplete = {
            options: {
              onlySelect: true,
              source: function( request, uiResponse ) {
                var categoriesPromise = Restangular.one('search').all('users').getList({ name: request.term });

                categoriesPromise.then(function(response) {
                  uiResponse( $.map( response.data, function( user ) {
                    return {
                      label: user.name,
                      value: user.name,
                      user: {id: user.id, name: user.name}
                    };
                  }));
                });
              },
              messages: {
                noResults: '',
                results: function() {}
              }
            }
          };

          $scope.usersAutocomplete.events = {
            select: function( event, ui ) {
              var found = false;

              for (var i = $scope.users.length - 1; i >= 0; i--) {
                if ($scope.users[i].id === ui.item.user.id)
                {
                  found = true;
                }
              }

              if (!found)
              {
                $scope.users.push(ui.item.user);
              }
            },

            change: function() {
              $scope.field.text = '';
              $scope.$broadcast('focusField', true);
            }
          };

          $scope.removeUser = function(user) {
            $scope.users.splice($scope.users.indexOf(user), 1);
          };

          $scope.save = function() {
            for (var i = $scope.users.length - 1; i >= 0; i--) {
              var filter = {
                title: 'Usuário',
                type: 'authors',
                desc: $scope.users[i].name,
                value: $scope.users[i].id
              };

              $scope.activeAdvancedFilters.push(filter);
            }

            $modalInstance.close();
          };

          $scope.close = function() {
            $modalInstance.close();
          };
        }]
      });
    },

    // advanced filter by date
    period: function(activeAdvancedFilters) {
      $modal.open({
        templateUrl: 'views/filters/period.html',
        windowClass: 'filterPeriodModal',
        resolve: {
          activeAdvancedFilters: function() {
            return activeAdvancedFilters;
          }
        },
        controller: ['$scope', '$modalInstance', 'activeAdvancedFilters', function($scope, $modalInstance, activeAdvancedFilters) {
          $scope.activeAdvancedFilters = activeAdvancedFilters;
          $scope.period = {beginDate: new Date(), endDate: new Date(), tab: 'between'};

          $scope.save = function() {
            if ($scope.period.tab === 'between' || $scope.period.tab === 'from')
            {
              var beginDateFilter = {
                title: 'A partir da data',
                type: 'beginDate',
                desc: $scope.period.beginDate.getDate() + '/' + ($scope.period.beginDate.getMonth() + 1) + '/' + $scope.period.beginDate.getFullYear(),
                value: $scope.period.beginDate
              };

              $scope.activeAdvancedFilters.push(beginDateFilter);
            }

            if ($scope.period.tab === 'between' || $scope.period.tab === 'to')
            {
              var endDateFilter = {
                title: 'Até a data',
                type: 'endDate',
                desc: $scope.period.endDate.getDate() + '/' + ($scope.period.endDate.getMonth() + 1) + '/' + $scope.period.endDate.getFullYear(),
                value: $scope.period.endDate
              };

              $scope.activeAdvancedFilters.push(endDateFilter);
            }

            $modalInstance.close();
          };

          $scope.close = function() {
            $modalInstance.close();
          };
        }]
      });
    },

    // advanced filter by geographic area
    area: function(activeAdvancedFilters) {
      return $modal.open({
        templateUrl: 'views/filters/area.html',
        windowClass: 'filterAreaModal',
        resolve: {
          activeAdvancedFilters: function() {
            return activeAdvancedFilters;
          }
        },
        controller: ['$scope', '$modalInstance', 'activeAdvancedFilters', function($scope, $modalInstance, activeAdvancedFilters) {
          $scope.activeAdvancedFilters = activeAdvancedFilters;

          $scope.save = function() {
            for (var i = $scope.circles.length - 1; i >= 0; i--) {
              var beginDateFilter = {
                title: 'Perímetro',
                type: 'area',
                desc: $scope.circles[i].get('distance').toFixed(2).replace('.', ',') + 'km de ' + $scope.circles[i].get('position').lat().toFixed(4) + ', ' + $scope.circles[i].get('position').lng().toFixed(4),
                value: {latitude: $scope.circles[i].get('position').lat(), longitude: $scope.circles[i].get('position').lng(), distance: $scope.circles[i].get('distance') * 1000} // we convert the distance to meters, as used in the API
              };

              $scope.activeAdvancedFilters.push(beginDateFilter);
            }

            $modalInstance.close();
          };

          $scope.close = function() {
            $modalInstance.close();
          };
        }]
      });
    },

    fields: function(categories, activeAdvancedFilters) {
      $modal.open({
        templateUrl: 'views/filters/fields.html',
        windowClass: 'fieldsCategoriesModal',
        resolve: {
          categories: function() {
            return categories;
          },

          activeAdvancedFilters: function() {
            return activeAdvancedFilters;
          }
        },
        controller: ['$scope', '$modalInstance', 'categories', 'activeAdvancedFilters', function($scope, $modalInstance, categories, activeAdvancedFilters) {
          $scope.categories = categories;
          $scope.activeAdvancedFilters = activeAdvancedFilters;

          $scope.items = [];

          $scope.methods = [
            { condition: 'greater_than', text: 'Maior que' },
            { condition: 'lesser_than', text: 'Menor' },
            { condition: 'equal_to', text: 'Igual a' },
            { condition: 'different', text: 'Diferente de' },
            { condition: 'like', text: 'Parecido com' },
            { condition: 'includes', text: 'Inclui' },
            { condition: 'excludes', text: 'Não inclui' },
          ];

          $scope.newField = {
            category: null,
            condition: null,
            field: null,
            value: null
          };

          $scope.selectCategory = function(category) {
            // create array just with fields
            category.fields = [];

            for (var i = category.sections.length - 1; i >= 0; i--) {
              for (var j = category.sections[i].fields.length - 1; j >= 0; j--) {
                category.fields.push(category.sections[i].fields[j]);
              }
            }

            $scope.newField.category = category;
            $scope.newField.condition = null;
            $scope.newField.field = null;
            $scope.newField.value = null;
            $scope.newField.fieldId = null;
          };

          $scope.selectCondition = function(condition) {
            $scope.newField.condition = condition;
          };

          $scope.$watch('newField.fieldId', function() {
            if ($scope.newField.category !== null && $scope.newField.fieldId !== null)
            {
              for (var i = $scope.newField.category.fields.length - 1; i >= 0; i--) {
                if ($scope.newField.category.fields[i].id == $scope.newField.fieldId)
                {
                  $scope.newField.field = $scope.newField.category.fields[i];
                }
              };
            }
          });

          $scope.selectField = function(field) {
            $scope.newField.field = field;
          };

          $scope.addItem = function() {
            $scope.items.push(angular.copy($scope.newField));
          };

          $scope.save = function() {
            for (var i = $scope.items.length - 1; i >= 0; i--) {
              var filter = {
                title: 'Campo',
                type: 'fields',
                desc: $scope.items[i].field.label + ': ' + $scope.items[i].condition.text + ' ' + $scope.items[i].value,
                value: {id: $scope.items[i].field.id, condition: $scope.items[i].condition.condition, value: $scope.items[i].value}
              };

              $scope.activeAdvancedFilters.push(filter);
            }

            $modalInstance.close();
          };

          $scope.close = function() {
            $modalInstance.close();
          };
        }]
      });
    },

    share: function() {
      $modal.open({
        templateUrl: 'views/layout/share.html',
        windowClass: 'shareModal',
        resolve: {
          url: function() {
            var deferred = $q.defer();

            var request = gapi.client.urlshortener.url.insert({
              'resource': {'longUrl': $location.absUrl()}
            });

            request.execute(function(response) {
              deferred.resolve(response.id);
            });

            return deferred.promise;
          }
        },
        controller: ['$scope', '$modalInstance', 'url', function($scope, $modalInstance, url) {
          $scope.url = url;

          $scope.close = function() {
            $modalInstance.close();
          };
        }]
      });
    }
  };
});
