'use strict';

angular.module('zupPainelApp')

.controller('InventoriesCategoriesEditCtrl', function ($scope, $routeParams, Restangular, $q, $modal, $window, $location, FileUploader) {
  var updating = $scope.updating = false;

  var categoryId = $routeParams.categoryId;

  if (typeof categoryId !== 'undefined')
  {
    updating = true;
    $scope.updating = true;
  }

  $scope.unsavedCategory = false;
  $scope.currentTab = 'triggers';

  $scope.availableInputs = [
    {kind: 'text', name: 'Campo de texto', multipleOptions: false},
    {kind: 'integer', name: 'Campo numérico', multipleOptions: false},
    {kind: 'decimal', name: 'Campo decimal', multipleOptions: false},
    {kind: 'checkbox', name: 'Campo de múltipla escolha', multipleOptions: true},
    {kind: 'radio', name: 'Campo de escolha única', multipleOptions: true},
    {kind: 'select', name: 'Campo de lista', multipleOptions: true},
    {kind: 'meters', name: 'Campo em metros', multipleOptions: false},
    {kind: 'centimeters', name: 'Campo em centímetros', multipleOptions: false},
    {kind: 'kilometers', name: 'Campo em quilômetros', multipleOptions: false},
    {kind: 'years', name: 'Campo em anos', multipleOptions: false},
    {kind: 'months', name: 'Campo em meses', multipleOptions: false},
    {kind: 'days', name: 'Campo em dias', multipleOptions: false},
    {kind: 'hours', name: 'Campo em horas', multipleOptions: false},
    {kind: 'seconds', name: 'Campo em segundos', multipleOptions: false},
    {kind: 'angle', name: 'Campo de ângulo', multipleOptions: false},
    {kind: 'date', name: 'Campo de data', multipleOptions: false},
    {kind: 'time', name: 'Campo de tempo', multipleOptions: false},
    {kind: 'cpf', name: 'Campo de CPF', multipleOptions: false},
    {kind: 'cnpj', name: 'Campo de CNPJ', multipleOptions: false},
    {kind: 'url', name: 'Campo de URL', multipleOptions: false},
    {kind: 'email', name: 'Campo de e-mail', multipleOptions: false},
    {kind: 'images', name: 'Campo de imagens', multipleOptions: false},
  ];

  $scope.kindHasMultipleOptions = function(kind) {
    for (var i = $scope.availableInputs.length - 1; i >= 0; i--) {
      if ($scope.availableInputs[i].kind === kind)
      {
        return $scope.availableInputs[i].multipleOptions === true;
      }
    }

    return false;
  };

  $scope.loading = true;

  $scope.category = {};

  if (updating)
  {
    var categoryPromise = Restangular.one('inventory').one('categories', categoryId).get({display_type: 'full'}); // jshint ignore:line
    var groupsPromise = Restangular.all('groups').getList();

    $q.all([groupsPromise, categoryPromise]).then(function(responses) {
      $scope.groups = responses[0].data;
      $scope.category = responses[1].data;

      if ($scope.category.plot_format === 'pin') // jshint ignore:line
      {
        $scope.category.plot_format = false; // jshint ignore:line
      }
      else
      {
        $scope.category.plot_format = true; // jshint ignore:line
      }

      // watch for modifications in $scope.category
      $scope.$watch('category', function(newValue, oldValue) {
        if (newValue !== oldValue)
        {
          $scope.unsavedCategory = true;
        }
      }, true);

      $scope.loading = false;
    });
  }
  else
  {
    $scope.loading = false;

    // added fake fields
    $scope.category.title = 'Nova categoria sem título';
    $scope.category.color = '#2AB4DC';
    $scope.category.icon = 'R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    $scope.category.marker = 'R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    $scope.category.pin = 'R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    $scope.category.plot_format = false; // jshint ignore:line
    $scope.category.statuses = [];

    $scope.category.sections = [{
        'title': 'Localização',
        'required': true,
        'location': true,
        'fields': [
          {
            'title': 'longitude',
            'kind': 'text',
            'size': null,
            'inventory_section_id': 14,
            'available_values': null,
            'position': 1,
            'label': 'Longitude',
            'maximum': null,
            'minimum': null,
            'required': true,
            'location': true
          },
          {
            'title': 'postal_code',
            'kind': 'text',
            'size': null,
            'inventory_section_id': 14,
            'available_values': null,
            'position': 3,
            'label': 'CEP',
            'maximum': null,
            'minimum': null,
            'required': false,
            'location': true
          },
          {
            'title': 'road_classification',
            'kind': 'text',
            'size': null,
            'inventory_section_id': 14,
            'available_values': null,
            'position': 8,
            'label': 'Classificação Viária',
            'maximum': null,
            'minimum': null,
            'required': false,
            'location': true
          },
          {
            'title': 'city',
            'kind': 'text',
            'size': null,
            'inventory_section_id': 14,
            'available_values': null,
            'position': 5,
            'label': 'Cidade',
            'maximum': null,
            'minimum': null,
            'required': false,
            'location': true
          },
          {
            'title': 'latitude',
            'kind': 'text',
            'size': null,
            'inventory_section_id': 14,
            'available_values': null,
            'position': 0,
            'label': 'Latitude',
            'maximum': null,
            'minimum': null,
            'required': true,
            'location': true
          },
          {
            'title': 'address',
            'kind': 'text',
            'size': null,
            'inventory_section_id': 14,
            'available_values': null,
            'position': 2,
            'label': 'Endereço',
            'maximum': null,
            'minimum': null,
            'required': false,
            'location': true
          },
          {
            'title': 'district',
            'kind': 'text',
            'size': null,
            'inventory_section_id': 14,
            'available_values': null,
            'position': 4,
            'label': 'Bairro',
            'maximum': null,
            'minimum': null,
            'required': false,
            'location': true
          },
          {
            'title': 'state',
            'kind': 'text',
            'size': null,
            'inventory_section_id': 14,
            'available_values': null,
            'position': 6,
            'label': 'Estado',
            'maximum': null,
            'minimum': null,
            'required': false,
            'location': true
          },
          {
            'title': 'codlog',
            'kind': 'text',
            'size': null,
            'inventory_section_id': 14,
            'available_values': null,
            'position': 7,
            'label': 'Codlog',
            'maximum': null,
            'minimum': null,
            'required': false,
            'location': true
          }
        ]
      }];

    // watch for modifications in $scope.category
    $scope.$watch('category', function(newValue, oldValue) {
      if (newValue !== oldValue)
      {
        $scope.unsavedCategory = true;
      }
    }, true);
  }

  $scope.editFieldOptions = function(field) {
    $modal.open({
      templateUrl: 'views/inventories/editFieldOptions.html',
      windowClass: 'editFieldOptions',
      controller: ['$scope', '$modalInstance', function($scope, $modalInstance) {
        $scope.field = field;

        $scope.value = {importing: false};

        $scope.toggleImport = function() {
          if ($scope.value.importing === true)
          {
            $scope.value.importing = false;
          }
          else
          {
            $scope.value.importing = true;
          }
        };

        $scope.newValue = function() {
          if ($scope.value.importing === true)
          {
            var newValues = $scope.value.multipleOptionsText.split(/\n/);

            field.available_values = field.available_values.concat(newValues);

            $scope.value.multipleOptionsText = null;
          }
          else
          {
            field.available_values.push($scope.value.text);
          }

          $scope.value.text = null;
        };

        $scope.clear = function() {
          field.available_values = [];
        };

        $scope.close = function() {
          $modalInstance.close();
        };
      }]
    });
  };

  // send alert to user before leaving the page that modifications are not saved
  $window.onbeforeunload = function() {
    if ($scope.unsavedCategory === true)
    {
      return 'Você tem certeza que deseja sair? Há alterações que não foram salvas.';
    }
    else
    {
      return null;
    }
  };

  $scope.goBack = function() {
    if ($scope.unsavedCategory === true)
    {
      if (window.confirm('Você tem certeza que deseja sair? Há alterações que não foram salvas.'))
      {
        $scope.unsavedCategory = false;
        $scope.loading = true;
        $location.path('/inventories/categories');
      }
    }
    else
    {
      $scope.loading = true;
      $location.path('/inventories/categories');
    }
  };

  $scope.newSection = function() {
    var newSection = {title: 'Nova seção sem título', required: false, location: false, fields: []};

    $scope.category.sections.push(newSection);

    // NO NO NO THIS WASNT SUPPOSE TO BE HERE :(:(::())) ILL CRY FOREVA
    // PLS BE SMAR T AND PUT IN A DIRECTIVE
    // PLS
    $('html, body').animate({ scrollTop: $(document).height() }, 'slow');
  };

  // we add a new status and open the edit modal
  $scope.newStatus = function() {
    $modal.open({
      templateUrl: 'views/inventories/editStatus.html',
      windowClass: 'editInventoryStatusesModal',
      resolve: {
        statuses: function() {
          return $scope.category.statuses;
        }
      },
      controller: ['$scope', '$modalInstance', 'statuses', function($scope, $modalInstance, statuses) {
        $scope.status = {color: '#2FB4E6'};

        $scope.save = function() {
          if (updating)
          {
            var newStatusPromise = Restangular.one('inventory').one('categories', categoryId).post('statuses', {title: $scope.status.title, color: $scope.status.color});

            newStatusPromise.then(function(response) {
              statuses.push(Restangular.stripRestangular(response.data));

              $modalInstance.close();
            });
          }
          else
          {
            statuses.push({title: $scope.status.title, color: $scope.status.color});

            $modalInstance.close();
          }
        };

        $scope.close = function() {
          $modalInstance.close();
        };
      }]
    });
  };

  // modal for editing and adding a new status
  $scope.editStatus = function (status) {
    $modal.open({
      templateUrl: 'views/inventories/editStatus.html',
      windowClass: 'editInventoryStatusesModal',
      resolve: {
        status: function() {
          return status;
        }
      },
      controller: ['$scope', '$modalInstance', 'status', function($scope, $modalInstance, status) {
        $scope.status = angular.copy(status);

        $scope.save = function() {
          if (updating)
          {
            var updateStatusPromise = Restangular.one('inventory').one('categories', categoryId).one('statuses', status.id).customPUT($scope.status);

            updateStatusPromise.then(function() {
              status.title = $scope.status.title;
              status.color = $scope.status.color;

              $modalInstance.close();
            });
          }
          else
          {
            status.title = $scope.status.title;
            status.color = $scope.status.color;

            $modalInstance.close();
          }
        };

        $scope.close = function() {
          $modalInstance.close();
        };
      }]
    });
  };

  $scope.removeStatus = function(status) {
    if (typeof status.id !== 'undefined')
    {
      var deletePromise = Restangular.one('inventory').one('categories', categoryId).one('statuses', status.id).remove();

      deletePromise.then(function() {
        $scope.category.statuses.splice($scope.category.statuses.indexOf(status), 1);
      });
    }
    else
    {
      $scope.category.statuses.splice($scope.category.statuses.indexOf(status), 1);
    }
  };

  $scope.$on('hidePopovers', function(event, data) {
    // tell each popover to close before opening a new one
    $scope.$broadcast('hideOpenPopovers', data);
  });

  $scope.uploaderQueue = {items: []};

  $scope.editCategoryOptions = function () {
    $modal.open({
      templateUrl: 'views/inventories/editCategoryOptions.html',
      windowClass: 'editCategory',
      resolve: {
        category: function() {
          return $scope.category;
        },

        uploaderQueue: function() {
          return $scope.uploaderQueue;
        }
      },
      controller: ['$scope', '$modalInstance', 'category', 'uploaderQueue', function($scope, $modalInstance, category, uploaderQueue) {
        $scope.category = category;
        $scope.uploaderQueue = uploaderQueue;

        $scope.icon = category.original_icon; // jshint ignore:line

        // Image uploader
        var uploader = $scope.uploader = new FileUploader();

        // Images only
        uploader.filters.push({
          name: 'onlyImages',
          fn: function(item, options) {
            var type = uploader.isHTML5 ? item.type : '/' + item.value.slice(item.value.lastIndexOf('.') + 1);
            type = '|' + type.toLowerCase().slice(type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
          }
        });

        uploader.onAfterAddingFile = function() {
          $scope.$apply(function() {
            $scope.uploaderQueue.items = uploader.queue;
          });
        };

        $scope.close = function() {
          $modalInstance.close();
        };
      }]
    });
  };

  $scope.send = function() {
    $scope.processingForm = true;

    var icon, promises = [];

    // Add images to queue for processing it's dataUrl
    function addAsync(file) {
      var deferred = $q.defer();

      var picReader = new FileReader();

      picReader.addEventListener('load', function(event) {
        var picFile = event.target;

        icon = picFile.result.replace(/^data:image\/[^;]+;base64,/, '');
        deferred.resolve();
      });

      // pass as base64 and strip data:image
      picReader.readAsDataURL(file);

      return deferred.promise;
    }

    for (var i = $scope.uploaderQueue.items.length - 1; i >= 0; i--) {
      promises.push(addAsync($scope.uploaderQueue.items[i]._file));
    }

    if ($scope.category.plot_format === false) // jshint ignore:line
    {
      $scope.category.plot_format = 'pin'; // jshint ignore:line
    }
    else
    {
      $scope.category.plot_format = 'marker'; // jshint ignore:line
    }

    // wait for images to process as base64
    $q.all(promises).then(function() {
      var formattedData = {title: $scope.category.title, require_item_status: $scope.category.require_item_status, statuses: $scope.category.statuses, color: $scope.category.color, plot_format: $scope.category.plot_format}; // jshint ignore:line
      var formattedFormData = {sections: $scope.category.sections};

      if (updating)
      {
        // we don't need to update 'statuses' when doing PUT
        // /\ SMART BOY!!!!
        delete formattedData.statuses;

        if (icon)
        {
          formattedData.icon = icon;
        }

        var putCategoryPromise = Restangular.one('inventory').one('categories', categoryId).customPUT(formattedData);
        var putCategoryFormsPromise = Restangular.one('inventory').one('categories', categoryId).one('form').customPUT(formattedFormData);

        $q.all([putCategoryPromise, putCategoryFormsPromise]).then(function() {
          $scope.showMessage('ok', 'A categoria de inventário foi atualizada com sucesso!', 'success', true);

          $scope.unsavedCategory = false;
          $scope.processingForm = false;
        }, function() {
          $scope.showMessage('exclamation-sign', 'O inventário não pode ser atualizado.', 'error', true);

          $scope.processingForm = false;
        });
      }
      else
      {
        if (icon)
        {
          formattedData.icon = icon;
        }
        else
        {
          formattedData.icon = $scope.category.icon;
        }

        var postCategoryPromise = Restangular.one('inventory').post('categories', formattedData);

        postCategoryPromise.then(function(response) {
          var newCategory = response.data, updateFieldsIds = {}, updateSectionId;

          // before updating the forms, let's set each field id to our own
          for (var i = newCategory.sections.length - 1; i >= 0; i--) {
            if (newCategory.sections[i].location === true)
            {
              updateSectionId = newCategory.sections[i].id;

              // we populate updateFieldsIds with each field's title and it's id
              for (var j = newCategory.sections[i].fields.length - 1; j >= 0; j--) {
                updateFieldsIds[newCategory.sections[i].fields[j].title] = newCategory.sections[i].fields[j].id;
              }
            }
          }

          console.log(updateFieldsIds);

          // now we update our array of fields with the new ids
          for (var x = $scope.category.sections.length - 1; x >= 0; x--) {
            var section = $scope.category.sections[x];

            if (section.location === true)
            {
              section.id = updateSectionId;

              for (var z = section.fields.length - 1; z >= 0; z--) {
                section.fields[z].id = updateFieldsIds[section.fields[z].title];
              }
            }
          }

          var putCategoryFormsPromise = Restangular.one('inventory').one('categories', newCategory.id).one('form').customPUT(formattedFormData);

          putCategoryFormsPromise.then(function() {
            $location.path('/inventories/categories/' + newCategory.id + '/edit');
          });
        });
      }
    });
  };
});
