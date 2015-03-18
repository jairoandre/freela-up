'use strict';

angular
  .module('GroupsEditControllerModule', [])

  .controller('GroupsEditController', function ($scope, Restangular, $stateParams, $location, $timeout, groupResponse, groupsPermissionsResponse, groupsResponse, flowsResponse, inventoriesCategoriesResponse, reportsCategoriesResponse) {
    $scope.group = groupResponse.data;
    $scope.permissions = groupsPermissionsResponse.data;
    $scope.groups = groupsResponse.data;
    $scope.flows = flowsResponse.data;
    $scope.inventoriesCategories = inventoriesCategoriesResponse.data;
    $scope.reportsCategories = reportsCategoriesResponse.data;

    $scope.newPermission = { type: null, objects: [], slugs: [] };

    $scope.isString = function(variable) {
      return typeof variable === 'string';
    };

    // available types
    $scope.availablePermissionTypes = [
      {
        type: 'flow',
        name: 'Fluxos',
        permissionsNames: [
          {
            slug: 'flow_can_delete_own_cases',
            name: 'flow_can_delete_own_cases',
            needsObject: true
          },

          {
            slug: 'flow_can_execute_all_steps',
            name: 'flow_can_execute_all_steps',
            needsObject: true
          },

          {
            slug: 'flow_can_view_all_steps',
            name: 'flow_can_view_all_steps',
            needsObject: true
          },

          {
            slug: 'can_execute_step',
            name: 'can_execute_step',
            needsObject: true
          },

          {
            slug: 'can_view_step',
            name: 'can_view_step',
            needsObject: true
          },

          {
            slug: 'manage_flows',
            name: 'manage_flows',
            needsObject: false
          },

          {
            slug: 'flow_can_delete_all_cases',
            name: 'flow_can_delete_all_cases',
            needsObject: false
          }
        ]
      },

      {
        type: 'user',
        name: 'Usuários',
        permissionsNames: [
          {
            slug: 'users_full_access',
            name: 'Gerenciar todos os usuários',
            needsObject: false
          }
        ]
      },

      {
        type: 'group',
        name: 'Grupos',
        permissionsNames: [
          {
            slug: 'groups_full_access',
            name: 'Gerenciar todos os grupos',
            needsObject: false
          },

          {
            slug: 'group_edit',
            name: 'Editar e visualizar o grupo',
            needsObject: true
          },

          {
            slug: 'group_read_only',
            name: 'Visualizar o grupo',
            needsObject: true
          }
        ]
      },

      {
        type: 'other',
        name: 'Outros',
        permissionsNames: [
          {
            slug: 'panel_access',
            name: 'Acesso ao painel permitido',
            needsObject: false
          },

          {
            slug: 'manage_config',
            name: 'Gerenciar configurações do sistema',
            needsObject: false
          }
        ]
      },

      {
        type: 'inventory',
        name: 'Inventário',
        permissionsNames: [
          {
            slug: 'inventories_full_access',
            name: 'Gerenciar todas as categorias',
            needsObject: false
          },

          {
            slug: 'inventories_formulas_full_access',
            name: 'Gerenciar fórmulas',
            needsObject: false
          },

          {
            slug: 'inventories_items_create',
            name: 'Criar novos itens',
            needsObject: true
          },

          {
            slug: 'inventories_items_edit',
            name: 'Editar itens',
            needsObject: true
          },

          {
            slug: 'inventories_items_delete',
            name: 'Remover itens',
            needsObject: true
          },

          {
            slug: 'inventories_categories_edit',
            name: 'Editar a categoria',
            needsObject: true
          },

          {
            slug: 'inventories_items_read_only',
            name: 'Visualizar itens',
            needsObject: true
          }
        ]
      },

      {
        type: 'report',
        name: 'Relatos',
        permissionsNames: [
          {
            slug: 'reports_full_access',
            name: 'Gerenciar todos as categorias',
            needsObject: false
          },

          {
            slug: 'reports_items_create',
            name: 'Criar novos relatos',
            needsObject: true
          },

          {
            slug: 'reports_items_delete',
            name: 'Remover relatos',
            needsObject: true
          },

          {
            slug: 'reports_items_edit',
            name: 'Editar relatos',
            needsObject: true
          },

          {
            slug: 'reports_categories_edit',
            name: 'Editar as categorias',
            needsObject: true
          },

          {
            slug: 'reports_items_read_only',
            name: 'Visualizar relatos',
            needsObject: true
          }
        ]
      }
    ];

    // getters
    var getType = function(type) {
      for (var i = $scope.availablePermissionTypes.length - 1; i >= 0; i--) {
        if ($scope.availablePermissionTypes[i].type === type) return $scope.availablePermissionTypes[i];
      };

      return null;
    };

    $scope.getTypeName = function(type) {
      return getType(type) ? getType(type).name : type;
    };

    $scope.getTypePermissions = function(type) {
      return getType(type) ? getType(type).permissionsNames : null;
    };

    var getPermission = function(type, slug) {
      var type = getType(type);

      if (!type) return null;

      for (var i = type.permissionsNames.length - 1; i >= 0; i--) {
        if (type.permissionsNames[i].slug === slug)
        {
          return type.permissionsNames[i];
        }
      };

      return null;
    };

    $scope.getPermissionsExcerpt = function() {
      switch ($scope.newPermission.slugs.length)
      {
        case 0:
          return 'Selecione a permissão';
        break;

        case 1:
          return $scope.getPermissionName($scope.newPermission.type, $scope.newPermission.slugs[0]);
        break;

        default:
          return $scope.newPermission.slugs.length + ' permissões selecionadas';
      }
    };

    $scope.isPermissionSelected = function(slug) {
      var i = $scope.newPermission.slugs.indexOf(slug);

      return i !== -1;
    };

    $scope.togglePermission = function(slug) {
      var i = $scope.newPermission.slugs.indexOf(slug);

      if (i === -1)
      {
        $scope.newPermission.slugs.push(slug);
      }
      else
      {
        $scope.newPermission.slugs.splice(i, 1);
      }
    };

    $scope.getObjectsExcerpt = function() {
      switch ($scope.newPermission.objects.length)
      {
        case 0:
          return 'Selecione uma categoria';
        break;

        case 1:
          return $scope.newPermission.objects[0].name || $scope.newPermission.objects[0].title;
        break;

        default:
          return $scope.newPermission.objects.length + ' categorias selecionadas';
      }
    };

    $scope.isObjectSelected = function(objectId) {
      for (var i = $scope.newPermission.objects.length - 1; i >= 0; i--) {
        if ($scope.newPermission.objects[i].id === objectId) return true;
      };

      return false;
    };

    $scope.toggleObject = function(object) {
      var x = false;

      for (var i = 0 ; i < $scope.newPermission.objects.length; i++) {
        if ($scope.newPermission.objects[i].id == object.id)
        {
          x = i;
        }
      };

      if (x !== false)
      {
        $scope.newPermission.objects.splice(x, 1);
      }
      else
      {
        $scope.newPermission.objects.push(object);
      }
    };

    // We need to hide all permissions that a
    $scope.isObjectNeeded = function() {
      if ($scope.newPermission.slugs.length === 0)
      {
        return null;
      }

      for (var i = $scope.newPermission.slugs.length - 1; i >= 0; i--) {
        if (getPermission($scope.newPermission.type, $scope.newPermission.slugs[i]).needsObject)
        {
          return true;
        }
      };

      return false;
    };

    $scope.getPermissionName = function(type, slug) {
      if (!type || !slug) return false;

      return getPermission(type, slug) ? getPermission(type, slug).name : slug;
    };

    $scope.setNewPermissionType = function(type) {
      $timeout(function() {
        $scope.newPermission.objects = [];
        $scope.newPermission.slugs = [];

        $scope.showPermissionsMenu = false;
        $scope.showObjectsMenu = false;

        $scope.newPermission.type = type;
      });
    };

    $scope.createPermission = function() {
      $scope.creatingPermission = true;

      var type = $scope.newPermission.type, slugs = $scope.newPermission.slugs;

      if ($scope.newPermission.objects.length !== 0)
      {
        var objectIds = [];

        for (var i = $scope.newPermission.objects.length - 1; i >= 0; i--) {
          objectIds.push($scope.newPermission.objects[i].id);
        };
      }

      var postPermissionPromise = Restangular.one('groups', $scope.group.id).one('permissions', type).customPOST({ 'permissions': slugs, 'objects_ids': objectIds });

      postPermissionPromise.then(function(response) {
        $scope.creatingPermission = false;

        if ($scope.newPermission.objects.length === 0)
        {
          $scope.permissions.push({ permission_type: type, permission_names: slugs, object: null });
        }
        else
        {
          for (var i = $scope.newPermission.objects.length - 1; i >= 0; i--) {
            $scope.permissions.push({ permission_type: type, permission_names: slugs, object: $scope.newPermission.objects[i] });
          };
        }

        $scope.setNewPermissionType(null);
      });
    };

    $scope.removePermission = function(permissionObj, slug) {
      permissionObj.removingPermission = true;

      var objectId = permissionObj.object ? permissionObj.object.id : undefined;

      var deletePermissionPromise = Restangular.one('groups', $scope.group.id).one('permissions', permissionObj.permission_type).customDELETE(null, { permission: slug, object_id: objectId });

      deletePermissionPromise.then(function() {
        if (typeof permissionObj.permission_names === 'string' || (typeof permissionObj.permission_names === 'object' && permissionObj.permission_names.length === 1))
        {
          $scope.permissions.splice($scope.permissions.indexOf(permissionObj), 1);
        }
        else
        {
          permissionObj.permission_names.splice(permissionObj.permission_names.indexOf(slug), 1);
        }

        permissionObj.removingPermission = false;
      });
    };
  });
