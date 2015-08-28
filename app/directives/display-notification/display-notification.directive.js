/**
 * Created by Jairo on 19/07/2015.
 */
angular.module('DisplayNotificationDirectiveModule', ['ZupPrintDirectiveModule','ckeditor', 'angularLoad'])
  .directive('displayNotification', function ($modal) {
    return {
      restrict: 'A',
      scope: {
        displayNotification: '&'
      },
      link: function (scope, el, attrs) {
        el.on('click', function (evt) {
          $modal.open({
            backdrop: 'static',
            templateUrl: 'directives/display-notification/display-notification.template.html',
            windowClass: 'gallery-modal fade',
            resolve: {
              content: function(){
                return scope.displayNotification();
              }
            },
            controller: 'DisplayNotificationModalCtrl'
          });
          evt.preventDefault();
        });
      }
    }
  })
  .controller('DisplayNotificationModalCtrl', function($scope, $modalInstance, ENV, content, angularLoad){
    $scope.content = content;
    $scope.close = function() {
      $modalInstance.close();
    };
    $scope.scriptLoaded = false;
    var configureCkEditor = function () {
      $scope.ckeditorOptions = {
        readOnly: true,
        extraPlugins: 'sharedspace',
        sharedSpaces: {top: 'ckeditor-toolbar'}
      };

    };
    angularLoad.loadScript(ENV.ckeditorPath).then(function(){
      configureCkEditor();
      $scope.scriptLoaded = true;
    });
    $scope.$on('$locationChangeStart', function(evt) {
      evt.preventDefault();
      $modalInstance.dismiss('locationChange');
    });
  });
