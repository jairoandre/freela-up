'use strict';

angular
  .module('UserServiceModule', [])

  .service('User', ['$q', 'Auth', '$rootScope', '$state', function ($q, Auth, $rootScope, $state) {

    return function(options) {
      if (!options) options = {permissions: []};

      var deferred = $q.defer();

      Auth.check().then(function(user) {
        deferred.resolve(user);

        $rootScope.me = user;

        /**
        *   hasPermission() checks if a user has a permission inside `user`.
        *
        *   To check permissions that contains id's like `inventory_fields_can_edit` use:
        *   hasPermission('inventory_fields_can_edit', 32)
        *
        *   it will return true if user can edit it.
        **/

        $rootScope.hasPermission = function(permission, id) {
          for (var permissionName in user.permissions)
          {
            if (permissionName === permission)
            {
              if (typeof user.permissions[permissionName] === 'boolean')
              {
                return user.permissions[permissionName] === true;
              }
              else if (typeof user.permissions[permissionName] === 'object')
              {
                // if there is not `id` specified, we just check if the permission is empty
                if (typeof id === 'undefined')
                {
                  return (user.permissions[permissionName].length !== 0);
                }

                // in case there is a `id` specified, we need to look into the array
                for (var i = user.permissions[permissionName].length - 1; i >= 0; i--) {
                  if (id == user.permissions[permissionName][i])
                  {
                    return true;
                  }
                };
              }
            }
          }

          return false;
        };
      }, function() {
        // user is not logged
        deferred.resolve(null);

        // if user isn't logged we shall redirect to home page
        if (options.permissions.indexOf('isLogged') !== -1)
        {
          $state.go('user.login');
        }
      });

      return deferred.promise;

    };
  }]);
