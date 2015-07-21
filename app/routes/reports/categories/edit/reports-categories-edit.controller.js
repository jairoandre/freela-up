'use strict';

angular
  .module('ReportsCategoriesEditControllerModule', [
    'FormatErrorsHelperModule',
    'NgThumbComponentModule',
    'MultipleSelectListComponentModule',
    'ReportsCategoriesManageStatusesModalControllerModule',
    'ReportsCategoriesServiceModule'
  ])

  .controller('ReportsCategoriesEditController', function ($scope, $rootScope, $stateParams, Restangular, FileUploader, singleItemUploaderFilter, onlyImagesUploaderFilter, $q, $location, $modal, $document, reportCategoriesResponse, groupsResponse, Error, ReportsCategoriesService) {
    var updating = $scope.updating = false;
    var categoryId = $stateParams.id;

    if (typeof categoryId !== 'undefined')
    {
      updating = true;
      $scope.updating = true;
    }

    $scope.mainColors = ['#59B1DF', '#7DDCE2', '#64D2AF', '#5CB466', '#99C450', '#EACD31', '#F3AC2E', '#F18058', '#EF4D3E', '#E984FC', '#A37FE1', '#7A7AF2'];
    $scope.alternativeColors = ['#4383A6', '#5CAFB5', '#4D9F88', '#3E7148', '#73943D', '#AC9827', '#B78226', '#C45C35', '#A23463', '#A938BE', '#7340C1', '#5051BB', '#28344E', '#465366', '#677B86', '#8195A0', '#A0B2BCv', '#B9CDD8'];

    // Start loading & get necessary requests
    $scope.loading = true;

    $scope.defaultResolutionTimeSelection = 60;
    $scope.defaultUserResponseTimeSelection = 60;

    var DAY = 60 * 60 * 24, HOUR = 60 * 60, MINUTE = 60;

    var checkTimeFormat = function(timeInSeconds) {
      if (timeInSeconds % DAY == 0)
      {
        return DAY;
      }
      else if (timeInSeconds % HOUR == 0)
      {
        return HOUR;
      }
      else
      {
        return MINUTE;
      }
    };

    $scope.reportCategories = reportCategoriesResponse.data;
    $scope.groups = groupsResponse.data;

    var categoriesPromise = Restangular.one('inventory').all('categories').getList({ return_fields: 'id,title'}), category;

    if (updating)
    {
      // We create a empty category object to be passed on PUT
      category = $scope.category = {};

      var categoryPromise = Restangular.one('reports').one('categories', categoryId).get();

      $q.all([categoriesPromise, categoryPromise]).then(function(responses) {
        $scope.categories = responses[0].data;

        // ...and we populate $scope.category with the data from the server =)
        category.title = responses[1].data.title;
        category.color = responses[1].data.color;
        category.confidential = responses[1].data.confidential;
        category.parent_id = responses[1].data.parent_id;
        category.allows_arbitrary_position = responses[1].data.allows_arbitrary_position; // jshint ignore:line
        category.statuses = responses[1].data.statuses;
        category.private_resolution_time = responses[1].data.private_resolution_time;
        category.resolution_time_enabled = responses[1].data.resolution_time_enabled;
        category.comment_required_when_forwarding = responses[1].data.comment_required_when_forwarding;
        category.comment_required_when_updating_status = responses[1].data.comment_required_when_updating_status;
        category.solver_groups_ids = responses[1].data.solver_groups_ids;
        category.default_solver_group_id = responses[1].data.default_solver_group_id;

        if (responses[1].data.user_response_time !== null) // jshint ignore:line
        {
          $scope.enabledUserResponseTime = true;
          category.user_response_time = responses[1].data.user_response_time; // jshint ignore:line

          $scope.defaultUserResponseTimeSelection = checkTimeFormat(category.user_response_time);
          $scope.preferedUserResponseTime = category.user_response_time / $scope.defaultUserResponseTimeSelection;
        }

        if (responses[1].data.resolution_time !== null) // jshint ignore:line
        {
          // ...and convert resolution_time to minutes
          category.resolution_time = responses[1].data.resolution_time; // jshint ignore:line

          $scope.defaultResolutionTimeSelection = checkTimeFormat(category.resolution_time);
          $scope.preferedResolutionTime = category.resolution_time / $scope.defaultResolutionTimeSelection;
        }

        category.inventory_categories = []; // jshint ignore:line

        /* jshint ignore:start */
        if (typeof responses[1].data.inventory_categories == 'object' && responses[1].data.inventory_categories.length !== 0)
        {
          for (var i = responses[1].data.inventory_categories.length - 1; i >= 0; i--) {
            category.inventory_categories.push(responses[1].data.inventory_categories[i].id);
          };
        }
        /* jshint ignore:end */

        $scope.icon = responses[1].data.original_icon; // jshint ignore:line

        $scope.loading = false;
      });
    }
    else
    {
      categoriesPromise.then(function(response) {
        $scope.categories = response.data;

        $scope.loading = false;
      });

      $scope.enabledUserResponseTime = false;

      // We create a default
      category = $scope.category = {
        marker: 'R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
        inventory_categories: [], // jshint ignore:line
        allows_arbitrary_position: true, // jshint ignore:line
        color: '#2AB4DC',
        solver_groups_ids: [],
        default_solver_group_id: null,
        statuses: [
          {'title': 'Em andamento', 'color': '#f8b01d', 'initial': false, 'final': false, 'active': true, 'created_at': '2014-03-05T01: 12: 34.181-03: 00', 'updated_at': '2014-03-05T01: 12: 34.181-03: 00', 'private': false},
          {'title': 'Resolvidas', 'color': '#78c953', 'initial': false, 'final': true, 'active': true, 'created_at': '2014-03-05T01: 12: 34.195-03: 00', 'updated_at': '2014-03-05T01: 12: 34.195-03: 00', 'private': false},
          {'title': 'Não resolvidas', 'color': '#999999', 'initial': false, 'final': true, 'active': true, 'created_at': '2014-03-05T01: 12: 34.200-03: 00', 'updated_at': '2014-03-05T01: 12: 34.200-03: 00', 'private': false},
          {'title': 'Em aberto', 'color': '#ff0000', 'initial': true, 'final': false, 'active': true, 'created_at': '2014-03-17T22: 52: 50.365-03: 00', 'updated_at': '2014-03-17T22: 52: 50.365-03: 00', 'private': false}
        ]
      };
    }

    // Image uploader
    var uploader = $scope.uploader = new FileUploader();

    // Images only
    uploader.filters.push(onlyImagesUploaderFilter(uploader.isHTML5));

    /**
     * @todo Bug on angular-file-upload
     * https://github.com/nervgh/angular-file-upload/issues/290
     */
    uploader.filters.push(singleItemUploaderFilter);

    $scope.pickColor = function(color) {
      $scope.category.color = color;
    };

    $scope.pickIcon = function(icon) {
      $scope.selectedIcon = icon;
      uploader.queue = [];
    };

    $scope.filterByIds = function(item) {
      if (_.isUndefined(category.solver_groups_ids)) return false;
      if (!~category.solver_groups_ids.indexOf(item.id)) return false;

      return true;
    };

    $scope.categoriesAutocomplete = {
      options: {
        source: function( request, uiResponse ) {
          var categoriesPromise = Restangular.one('search').one('inventory').all('categories').getList({ title: request.term, return_fields: 'id,title' });

          categoriesPromise.then(function(response) {
            uiResponse( $.map( response.data, function( item ) {
              return {
                label: item.title,
                value: item.title,
                id: item.id
              };
            }));
          });
        },
        select: function( event, ui ) {
          $scope.addCategory(ui.item.id);
        },
        messages: {
          noResults: '',
          results: function() {}
        }
      }
    };

    $scope.addCategory = function(id) {
      if (!~category.inventory_categories.indexOf(id)) // jshint ignore:line
      {
        category.inventory_categories.push(id); // jshint ignore:line
      }
    };

    $scope.removeCategory = function(id) {
      category.inventory_categories.splice(category.inventory_categories.indexOf(id), 1); // jshint ignore:line
    };

    $scope.manageStatuses = function () {
      $modal.open({
        templateUrl: 'modals/reports/categories/manage-statuses/reports-categories-manage-statuses.template.html',
        windowClass: 'manageStatuses',
        resolve: {
          category: function() {
            return $scope.category;
          },
          updating: function() {
            return updating;
          },
          categoryId: function() {
            return categoryId;
          }
        },
        controller: 'ReportsCategoriesManageStatusesModalController'
      });
    };

    $scope.$watch('preferedResolutionTime', function() {
      category.resolution_time = $scope.preferedResolutionTime * $scope.defaultResolutionTimeSelection;
    });

    $scope.changeDefaultResolutionTimeSelection = function(seconds) {
      $scope.preferedResolutionTime = Math.round(category.resolution_time / seconds);
      $scope.defaultResolutionTimeSelection = seconds;
    };

    $scope.$watch('preferedUserResponseTime', function() {
      category.user_response_time = $scope.preferedUserResponseTime * $scope.defaultUserResponseTimeSelection;
    });

    $scope.changeDefaultUserResponseTimeSelection = function(seconds) {
      $scope.preferedUserResponseTime = Math.round(category.user_response_time / seconds);
      $scope.defaultUserResponseTimeSelection = seconds;
    };

    $scope.send = function() {
      $scope.inputErrors = null;
      $rootScope.resolvingRequest = true;
      var promises = [];

      // Add images to queue for processing it's dataUrl
      function addAsync(file) {
        var deferred = $q.defer();

        var picReader = new FileReader();

        picReader.addEventListener('load', function(event) {
          var picFile = event.target;

          var icon = picFile.result.replace(/^data:image\/[^;]+;base64,/, '');
          deferred.resolve(icon);
        });

        // pass as base64 and strip data:image
        picReader.readAsDataURL(file);

        return deferred.promise;
      }

      // if our upload queue is empty and we have a selectedIcon, we shall get it's base64 contents
      if (uploader.queue.length == 0 && $scope.selectedIcon)
      {
        var promise = (function() {
          var deferred = $q.defer();

          var canvas = $document[0].createElement('CANVAS');
          var ctx = canvas.getContext('2d');
          var img = new Image;

          img.crossOrigin = 'Anonymous';

          img.onload = function() {
            canvas.height = img.height;
            canvas.width = img.width;

            ctx.drawImage(img, 0, 0);

            var dataURL = canvas.toDataURL('image/png');

            deferred.resolve(dataURL.replace(/^data:image\/[^;]+;base64,/, ''));

            canvas = null;
          };

          img.src = 'assets/images/icons/' + $scope.selectedIcon + '.png';

          return deferred.promise;
        })();

        promises.push(promise);
      }
      else
      {
        for (var i = uploader.queue.length - 1; i >= 0; i--) {
          promises.push(addAsync(uploader.queue[i]._file));
        }
      }

      // wait for images to process as base64
      $q.all(promises).then(function(results) {
        var icon = results[0];

        var editedCategory = angular.copy(category);

        // change category.statuses to acceptable format for the API
        var tempStatuses = editedCategory.statuses;

        editedCategory.statuses = {};

        for (var i = tempStatuses.length - 1; i >= 0; i--) {
          tempStatuses[i].initial = tempStatuses[i].initial.toString();
          tempStatuses[i].final = tempStatuses[i].final.toString();
          tempStatuses[i].active = tempStatuses[i].active.toString();
          tempStatuses[i].private = tempStatuses[i].private.toString();

          editedCategory.statuses[i] = tempStatuses[i];
        }

        // And we convert the user selection to seconds
        editedCategory.resolution_time = editedCategory.resolution_time; // jshint ignore:line

        // also the user feedback time we convert it to seconds
        if (typeof editedCategory.user_response_time !== 'undefined' && editedCategory.user_response_time !== 'null' && $scope.enabledUserResponseTime == true) // jshint ignore:line
        {
          editedCategory.user_response_time = editedCategory.user_response_time; // jshint ignore:line
        }
        else
        {
          editedCategory.user_response_time = null; // jshint ignore:line
        }

        // PUT if updating and POST if creating a new category
        if (updating)
        {
          if (icon)
          {
            editedCategory.icon = icon;
          }

          var putCategoryPromise = Restangular.one('reports').one('categories', categoryId).withHttpConfig({ treatingErrors: true }).customPUT(editedCategory);

          putCategoryPromise.then(function() {
            ReportsCategoriesService.purgeCache();

            $scope.showMessage('ok', 'A categoria de relato foi atualizada com sucesso', 'success', true);

            $rootScope.resolvingRequest = false;
          }, function(response) {
            $scope.showMessage('exclamation-sign', 'A categoria de relato não pode ser salva', 'error', true);

            if (typeof response.data.error !== 'object')
            {
              Error.show(response);
            }
            else
            {
              $scope.inputErrors = response.data.error;
            }

            $rootScope.resolvingRequest = false;
          });
        }
        else
        {
          editedCategory.icon = icon;
          editedCategory.marker = icon;

          var postCategoryPromise = Restangular.one('reports').withHttpConfig({ treatingErrors: true }).post('categories', editedCategory);

          postCategoryPromise.then(function() {
            ReportsCategoriesService.purgeCache();

            $scope.showMessage('ok', 'A categoria de relato foi criada com sucesso', 'success', true);

            $location.path('/reports/categories');

            $rootScope.resolvingRequest = false;
          }, function(response) {
            $scope.showMessage('exclamation-sign', 'A categoria de relato não pode ser salva', 'error', true);

            if (typeof response.data.error !== 'object')
            {
              Error.show(response);
            }
            else
            {
              $scope.inputErrors = response.data.error;
            }

            $rootScope.resolvingRequest = false;
          });
        }
      });
    };
  });
