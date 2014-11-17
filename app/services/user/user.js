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
