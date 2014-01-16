'use strict';

angular.module('zupPainelApp')

.factory('Auth', function ($q, $http, $cookies) {
  var user = null;

  return {

    check: function() {
      var deferred = $q.defer(),
          token = this.getCookie();

      if (token !== null && user === null)
      {
        // has token, check it by getting user data
        var req = $http({method: 'GET', url: '{base_url}/me.json', headers: {'X-App-Token': token }});

        req.success(function(data) {
          // save user data returned by API
          user = data.user;

          deferred.resolve();
        });

        req.error(function() {
          deferred.reject();
        });
      }
      else if (token !== null)
      {
        // Has token and user data
        deferred.resolve();
      }
      else
      {
        // Doesn't have token, user needs to log in
        deferred.reject();
      }

      return deferred.promise;
    },

    getCookie: function() {
      var cookie = $cookies.token;

      if (typeof cookie === 'undefined')
      {
        return null;
      }

      return cookie;
    },

    saveCookie: function(token) {
      $cookies.token = token;
    },

    saveUser: function(data) {
      user = data;
    }

  };
});
