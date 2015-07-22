'use strict';

angular
  .module('ReportsCategoriesNotificationsLayoutControllerModule', ['ckeditor', 'angularLoad'])

  .controller('ReportsCategoriesNotificationsLayoutController', function ($scope, $modalInstance, $log, parentScope, notificationType, angularLoad) {

    $log.info('ReportsCategoriesNotificationsLayoutController created.');
    $scope.$on('$destroy', function () {
      $log.info('ReportsCategoriesNotificationsLayoutController destroyed.');
    });

    var originalLayout = angular.copy(notificationType.layout);

    $scope.notificationTypeOnLayoutModal = notificationType;

    $scope.loadingCkeditorScript = true;

    var configureCkEditor = function () {
      $scope.loadingCkeditorScript = false;
      $scope.ckeditorOptions = {

        allowedContent: true,
        extraPlugins: 'sharedspace,placeholder,base64image,font,imagepaste',
        sharedSpaces: {top: 'ckeditor-toolbar'},
        toolbarGroups: [
          {name: 'clipboard', groups: ['clipboard', 'undo']},
          {name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing']},
          {name: 'links', groups: ['links']},
          {name: 'insert', groups: ['insert']},
          {name: 'forms', groups: ['forms']},
          {name: 'tools', groups: ['tools']},
          {name: 'others', groups: ['others']},
          '/',
          {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
          {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph']},
          {name: 'document', groups: ['mode', 'document', 'doctools']},
          '/',
          {name: 'styles', groups: ['styles']},
          {name: 'colors', groups: ['colors']},
          {name: 'about', groups: ['about']}
        ],
        removeButtons: 'Underline,Subscript,Superscript,Maximize,Image'
      };
    }

    angularLoad.loadScript('bower_components/ckeditor/ckeditor.js').then(function(){
      configureCkEditor();
    });

    $scope.closeLayoutNotificationTypeModal = function () {
      if(!originalLayout && $scope.notificationTypeOnLayoutModal.layout.length === 0){
        $modalInstance.close();
        return;
      }
      if (!angular.equals(originalLayout,$scope.notificationTypeOnLayoutModal.layout)) {
        if (window.confirm('Você tem certeza que deseja sair? Há alterações que não foram salvas.')) {
          $scope.notificationTypeOnLayoutModal.layout = angular.copy(originalLayout);
          $modalInstance.close();
        }
      } else {
        $modalInstance.close();
      }
    };

    $scope.saveLayoutNotificationType = function () {
      if (!angular.equals(originalLayout,$scope.notificationTypeOnLayoutModal.layout)) {
        parentScope.verifyDirtyNotificationTypeMemento(parentScope.notificationTypeOriginator);
      }
      $modalInstance.close();
    }

  })
;
