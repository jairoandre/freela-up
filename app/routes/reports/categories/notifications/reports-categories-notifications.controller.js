'use strict';

angular
  .module('ReportsCategoriesNotificationsControllerModule', [])

  .controller('ReportsCategoriesNotificationsController', function ($scope, $stateParams, $state, Restangular, $q) {


    var categoryId = $scope.categoryId = $stateParams.categoryId;
    $scope.currentTab = 'fields';

    var categoryPromise = Restangular.one('reports').one('categories', categoryId).get();

    categoryPromise.then(function(r){
      var category = $scope.category =  r.data;
      $scope.statuses = category.statuses;
    });

    if (!$stateParams.id) {
      $scope.notification = {
        reports_categories_id: $scope.categoryId,
        title: 'Novo Tipo de Notificação',
        reports_status_id: '',
        deadline_in_days: 45,
        layout: '...',
        created_at: '2015-07-16T19:20:30-03:00',
        updated_at: "2015-07-16T19:20:30-03:00",
        color: 'red'
      }
    }


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
