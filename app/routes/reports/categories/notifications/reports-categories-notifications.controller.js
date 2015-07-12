'use strict';

angular
  .module('ReportsCategoriesNotificationsControllerModule', [])

  .controller('ReportsCategoriesNotificationsController', function ($scope, $stateParams, $state) {


    $scope.categoryId = $stateParams.categoryId;
    $scope.currentTab = 'fields';

    $scope.options = {
      allowedContent: true,
      entities: false,
      height: '100%',
      width: '100%',


      toolbarGroups: [
        { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
        { name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
        { name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
        { name: 'forms', groups: [ 'forms' ] },
        { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
        { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
        { name: 'links', groups: [ 'links' ] },
        { name: 'insert', groups: [ 'insert' ] },
        { name: 'styles', groups: [ 'styles' ] },
        { name: 'colors', groups: [ 'colors' ] },
        { name: 'tools', groups: [ 'tools' ] },
        { name: 'others', groups: [ 'others' ] },
        { name: 'about', groups: [ 'about' ] }
      ],
      removeButtons: 'Save,NewPage,Preview,Print,Templates,Source,Find,Replace,Scayt,SelectAll,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Link,Unlink,Anchor,CreatePlaceholder,Flash'
    }

    if (!$stateParams.id) {
      $scope.notification = {
        reports_categories_id: $scope.categoryId,
        title: 'Novo Tipo de Notificação',
        reports_status_id: 3,
        default_deadline_in_days: 45,
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
