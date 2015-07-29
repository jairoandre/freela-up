'use strict';

var scope;

angular
  .module('ReportsCategoriesNotificationsLayoutControllerModule', ['ckeditor', 'angularLoad'])

  .controller('ReportsCategoriesNotificationsLayoutController', function ($scope, $rootScope, $timeout, $location, $anchorScroll, $modalInstance, $log, parentScope, notificationType, angularLoad, ENV) {

    $log.info('ReportsCategoriesNotificationsLayoutController created.');
    $scope.$on('$destroy', function () {
      $log.info('ReportsCategoriesNotificationsLayoutController destroyed.');
    });

    scope = $scope;

    var originalLayout = angular.copy(notificationType.layout);

    $scope.notificationTypeOnLayoutModal = notificationType;

    $scope.loadingCkeditorScript = true;

    $scope.$on('$locationChangeStart',function(event, toState, toParams, fromState, fromParams){
      $scope.closeLayoutNotificationTypeModal();
      event.preventDefault();
    });

    var configureCkEditor = function () {
      $scope.loadingCkeditorScript = false;
      $scope.ckeditorOptions = {
        skin: 'bootstrapck',
        language: 'pt-br',
        height: '27cm',
        resize_enabled: false,
        removePlugins: 'elementspath',
        extraPlugins: 'sharedspace,tableresize,placeholder,base64image,font,imagepaste,image2',
        sharedSpaces: {top: 'ckeditor-toolbar'},
        toolbarGroups: [
          {name: 'clipboard', groups: ['clipboard', 'undo']},
          {name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing']},
          {name: 'links', groups: ['links']},
          {name: 'insert', groups: ['insert']},
          {name: 'forms', groups: ['forms']},
          {name: 'tools', groups: ['tools']},
          {name: 'others', groups: ['others']},
          {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph']},
          '/',
          {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
          {name: 'document', groups: ['mode', 'document', 'doctools']},
          {name: 'styles', groups: ['styles']},
          {name: 'colors', groups: ['colors']},
          {name: 'about', groups: ['about']}
        ],
        removeButtons: 'Maximize,Image'
      };
    }

    angularLoad.loadScript(ENV.ckeditorPath).then(function(){
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
