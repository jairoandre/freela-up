'use strict';

angular.module('zupPainelApp')

.service('User', ['$q', '$http', '$cookies', 'Auth', function ($q, $http, $cookies, Auth) {

  return function(email, password) {

    /**
      Simple Auth

      [code]
        var user = new User(email, password);
        var promise = user.auth();

        promise.then(function() {
          // success
        }, function() {
          // error
        });
      [/code]
    **/

    this.auth = function() {
      var deferred = $q.defer();

      var req = $http({method: 'POST', url: '{base_url}/authenticate.json', data: {email: email, password: password}});

      req.success(function(data) {
        // save user data returned by API
        Auth.saveUser(data.user);

        // save token on cookie
        Auth.saveCookie(data.token);

        deferred.resolve();
      });

      req.error(function(data, status, headers, config) {
        deferred.reject({data: data, status: status, config: config});
      });

      return deferred.promise;
    };

  };
}]);
