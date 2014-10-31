angular
  .module('IndexControllerModule', [])

  .controller('IndexController', function(User, $state) {
    if (User)
    {
      $state.go('reports.list');
    }
    else
    {
      $state.go('user.login');
    }
  });
