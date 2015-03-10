'use strict';

angular
  .module('AuthServiceModule', [])

  .factory('Auth', function ($q, Restangular, FullResponseRestangular, $cookies, $rootScope) {
    var user = null;

    return {
      check: function() {
        var deferred = $q.defer(),
            token = this.getToken();

        if (token !== null && user === null)
        {
          // has token, check it by getting user data
          var req = Restangular.one('me').get(), that = this;

          req.then(function(response) {
            // save user data returned by API
            that.saveUser(response.data);

            deferred.resolve(user);
          }, function() {
            deferred.reject();
            that.clearToken();
          });
        }
        else if (token !== null && user !== null)
        {
          // Has token and user data
          deferred.resolve(user);
        }
        else
        {
          // Doesn't have token, user needs to log in
          deferred.reject();
          this.clearToken();
        }

        return deferred.promise;
      },

      getToken: function() {
        var cookie = $cookies.token;

        if (typeof cookie === 'undefined')
        {
          return null;
        }

        return cookie;
      },

      saveToken: function(token) {
        $cookies.token = token;
      },

      clearToken: function() {
        delete $cookies.token;
      },

      saveUser: function(data) {
        user = data;
      },

      isLogged: function() {
        return user !== null && this.getToken() !== null;
      },

      login: function(email, pass) {
        FullResponseRestangular.setDefaultHeaders({'X-App-Token': this.getToken()});

        var deferred = $q.defer(), req = FullResponseRestangular.one('authenticate').post(null, {email: email, password: pass}), that = this;

        req.then(function(response) {
          that.saveUser(response.data.user);
          that.saveToken(response.data.token);

          Restangular.setDefaultHeaders({'X-App-Token': response.data.token});
          FullResponseRestangular.setDefaultHeaders({'X-App-Token': response.data.token});

          deferred.resolve();
        }, function() {
          deferred.reject();
        });

        return deferred.promise;
      },

      logout: function() {
        this.clearToken();
      }
    };
  });
