'use strict';

angular.module('zupPainelApp')

.factory('User', ['$q', '$http', function ($q, $http) {
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
        deferred.resolve(data);
      });

      req.error(function(data, status) {
        deferred.reject(data, status);
      });

      return deferred.promise;
    };

  };
}]);
