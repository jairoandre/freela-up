'use strict';

angular
  .module('ReportsCategoriesNotificationsLayoutControllerModule', ['ckeditor'])

  .controller('ReportsCategoriesNotificationsLayoutController', function ($scope, notificationType) {

    $scope.notificationType = notificationType;

    $scope.ckeditorOptions = {
      allowedContent: true,
      entities: false
    };

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
