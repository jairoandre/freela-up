'use strict';

angular
  .module('ReportsCategoriesNotificationsLayoutControllerModule', [])

  .controller('ReportsCategoriesNotificationsLayoutController', function ($scope, notificationType) {

    $scope.notificationType = notificationType;

    $scope.goBack = function () {
      if ($scope.unsavedNotification === true) {
        if (window.confirm('Você tem certeza que deseja sair? Há alterações que não foram salvas.')) {
          $scope.unsavedNotification = false;
          $scope.loading = true;
          $state.transitionTo('reports.categories.edit', {id: $scope.categoryId}, {'reload': true});
        }
      }
      else {
        $scope.loading = true;
        $state.transitionTo('reports.categories.edit', {id: $scope.categoryId}, {'reload': true});
      }
    };

  })
;
