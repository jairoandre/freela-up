'use strict';

angular
  .module('GroupsEditControllerModule', [])

  .controller('GroupsEditController', function ($scope, Restangular, $stateParams, $location, $q, groupResponse, groupsPermissionsResponse, groupsResponse, flowsResponse, inventoriesCategoriesResponse, reportsCategoriesResponse) {
    $scope.group = groupResponse.data;
    $scope.permissions = groupsPermissionsResponse.data;
    $scope.groups = groupsResponse.data;
    $scope.flows = flowsResponse.data;
    $scope.inventoriesCategories = inventoriesCategoriesResponse.data;
    $scope.reportsCategories = reportsCategoriesResponse.data;

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
            slug: 'manage_users',
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
            slug: 'manage_groups',
            name: 'Gerenciar todos os grupos',
            needsObject: false
          },

          {
            slug: 'groups_can_edit',
            name: 'Editar e visualizar',
            needsObject: true
          },

          {
            slug: 'groups_can_view',
            name: 'Visualizar',
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
            slug: 'manage_inventory_items',
            name: 'Gerenciar todos os itens',
            needsObject: false
          },

          {
            slug: 'edit_inventory_items',
            name: 'Editar todos os itens',
            needsObject: false
          },

          {
            slug: 'manage_inventory_formulas',
            name: 'Gerenciar fórmulas',
            needsObject: false
          },

          {
            slug: 'manage_inventory_categories',
            name: 'Gerenciar todas as categorias',
            needsObject: false
          },

          {
            slug: 'inventory_categories_can_edit',
            name: 'Editar e visualizar a categoria',
            needsObject: true
          },

          {
            slug: 'inventory_categories_can_view',
            name: 'Visualizar a categoria',
            needsObject: true
          }
        ]
      },

      {
        type: 'report',
        name: 'Relatos',
        permissionsNames: [
          {
            slug: 'manage_reports',
            name: 'Gerenciar todos os relatos',
            needsObject: false
          },

          {
            slug: 'manage_reports_categories',
            name: 'Gerenciar todas as categorias',
            needsObject: false
          },

          {
            slug: 'delete_reports',
            name: 'Remover todos os relatos',
            needsObject: false
          },

          {
            slug: 'edit_reports',
            name: 'Editar todos os relatos',
            needsObject: false
          },

          {
            slug: 'create_reports_from_panel',
            name: 'Pode criar relatos pelo painel',
            needsObject: false
          },

          {
            slug: 'reports_categories_can_edit',
            name: 'Editar',
            needsObject: true
          },

          {
            slug: 'reports_categories_can_view',
            name: 'Visualizar',
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

    $scope.isObjectNeeded = function(type, slug) {
      if (!type || !slug) return false;

      return getPermission(type, slug).needsObject;
    };

    $scope.getPermissionName = function(type, slug) {
      if (!type || !slug) return false;

      return getPermission(type, slug) ? getPermission(type, slug).name : slug;
    };

    $scope.newPermission = { type: null, object: null, slug: null };

    $scope.setNewPermissionType = function(type) {
      $scope.newPermission.type = type;
      $scope.newPermission.object = null;
      $scope.newPermission.slug = null;
    };

    $scope.createPermission = function() {
      $scope.creatingPermission = true;

      var type = $scope.newPermission.type,
          slug = $scope.newPermission.slug,
          objectIds = $scope.newPermission.object !== null ? [$scope.newPermission.object.id] : undefined;

      var postPermissionPromise = Restangular.one('groups', $scope.group.id).one('permissions', type).customPOST({ 'permissions': [slug], 'objects_ids': objectIds });

      postPermissionPromise.then(function(response) {
        $scope.creatingPermission = false;

        $scope.permissions.push({ permission_type: type, permission_names: slug, object: $scope.newPermission.object });

        $scope.newPermission = { type: null, object: null, slug: null };
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
