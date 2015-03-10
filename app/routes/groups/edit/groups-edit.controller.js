'use strict';

angular
  .module('GroupsEditControllerModule', [])

  .controller('GroupsEditController', function ($scope, Restangular, $stateParams, $location, $q, groupResponse, groupsPermissionsResponse) {
    $scope.group = groupResponse.data;
    $scope.permissions = groupsPermissionsResponse.data;

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
            name: 'manage_users',
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
            name: 'manage_groups',
            needsObject: false
          },

          {
            slug: 'groups_can_edit',
            name: 'groups_can_edit',
            needsObject: true
          },

          {
            slug: 'groups_can_view',
            name: 'groups_can_view',
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
            name: 'panel_access',
            needsObject: false
          },

          {
            slug: 'manage_config',
            name: 'manage_config',
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
            name: 'manage_inventory_items',
            needsObject: false
          },

          {
            slug: 'edit_inventory_items',
            name: 'edit_inventory_items',
            needsObject: false
          },

          {
            slug: 'manage_inventory_formulas',
            name: 'manage_inventory_formulas',
            needsObject: false
          },

          {
            slug: 'manage_inventory_categories',
            name: 'manage_inventory_categories',
            needsObject: false
          },

          {
            slug: 'inventory_categories_can_edit',
            name: 'inventory_categories_can_edit',
            needsObject: true
          },

          {
            slug: 'inventory_categories_can_view',
            name: 'inventory_categories_can_view',
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
            name: 'manage_reports',
            needsObject: false
          },

          {
            slug: 'manage_reports_categories',
            name: 'manage_reports_categories',
            needsObject: false
          },

          {
            slug: 'delete_reports',
            name: 'delete_reports',
            needsObject: false
          },

          {
            slug: 'edit_reports',
            name: 'edit_reports',
            needsObject: false
          },

          {
            slug: 'create_reports_from_panel',
            name: 'create_reports_from_panel',
            needsObject: false
          },

          {
            slug: 'reports_categories_can_edit',
            name: 'reports_categories_can_edit',
            needsObject: true
          },

          {
            slug: 'reports_categories_can_view',
            name: 'reports_categories_can_view',
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
      $scope.newPermission.objectId = null;
      $scope.newPermission.slug = null;
    };

    $scope.createPermission = function() {
      var type = $scope.newPermission.type,
          slug = $scope.newPermission.slug,
          objectIds = $scope.newPermission.object !== null ? [$scope.newPermission.object.id] : undefined;

      var postPermissionPromise = Restangular.one('groups', $scope.group.id).one('permissions', type).customPOST({ 'permissions': [slug], 'objects_ids': objectIds });

      postPermissionPromise.then(function(response) {
        $scope.permissions.unshift({ permission_type: type, permission_names: slug, object: $scope.newPermission.object });

        $scope.newPermission = { type: null, object: null, slug: null };
      });
    };

    // we get all data that is necessary for each permission
    /*var groupsPromise = Restangular.all('groups').getList();
    var reportsCategoriesPromise = Restangular.one('reports').all('categories').getList({ display_type: 'full' });
    var inventoryCategoriesPromise = Restangular.one('inventory').all('categories').getList();
    var flowsPromise = Restangular.all('flows').getList();

    var promises = [groupsPromise, reportsCategoriesPromise, inventoryCategoriesPromise, flowsPromise];

    $q.all(promises).then(function(responses) {
      $scope.data.groups = responses[0].data;
      $scope.data.reportsCategories = responses[1].data;
      $scope.data.inventoryCategories = responses[2].data;
      $scope.data.flows = responses[3].data;
    });*/
  });
