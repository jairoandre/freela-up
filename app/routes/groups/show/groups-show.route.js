angular
  .module('GroupsShowModule', [
    'GroupsShowControllerModule'
  ])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('groups.show', {
      url: '/{id:[0-9]{1,4}}',
      views: {
        '': {
          templateUrl: 'routes/groups/show/groups-show.template.html',
          controller: 'GroupsShowController',
          controllerAs: 'ctrl',
          resolve: {
            'Group': getGroup
          }
        }
      }
    });

    function getGroup(Restangular, $state, $stateParams, $rootScope) {
      return Restangular
          .one('groups', $stateParams.id)
          .withHttpConfig({treatingErrors: true})
          .get()
          .then(function (response) {
            return response.data;
          })
          .catch(function (response) {
            if (response.status === 403) {
              $rootScope.showMessage(
                'exclamation-sign',
                'Você não possui permissão para visualizar essa página',
                'error'
              );
            }

            $state.go('groups.list');
          })
    }
  }]);
