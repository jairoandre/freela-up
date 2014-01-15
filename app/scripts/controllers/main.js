'use strict';

angular.module('zupPainelApp')

.controller('MainCtrl', function (User) {
  var email = 'e', password = 'a';

  var user = new User(email, password);

  user.auth().then(function() {
    console.log('success');
  }, function() {
    console.log('error');
  });
});
