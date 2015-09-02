/**
 * Created by Jairo on 19/07/2015.
 */
angular.module('DisplayNotificationDirectiveModule', ['ZupPrintDirectiveModule', 'ckeditor', 'angularLoad'])

  .directive('displayNotification', function ($modal) {
    return {
      restrict: 'A',
      scope: {
        displayNotification: '&'
      },
      link: function (scope, el, attrs) {
        var fncClick = function (evt) {
          evt.preventDefault();

          $modal.open({
            backdrop: 'static',
            templateUrl: 'directives/display-notification/display-notification.template.html',
            windowClass: 'gallery-modal fade',
            resolve: {
              content: function () {
                return scope.displayNotification();
              }
            },
            controller: 'DisplayNotificationModalCtrl'
          });
        };

        el.on('click', fncClick);
        scope.$on('$destroy', function () {
          el.off('click', fncClick);
        });
      }
    }
  })
  .controller('DisplayNotificationModalCtrl', function ($scope, $modalInstance, ENV, content, angularLoad) {

    $scope.content = content;
    $scope.scriptLoaded = false;

    $scope.close = function () {
      $modalInstance.close();
    };

    angularLoad.loadScript(ENV.ckeditorPath).then(function () {

      $scope.ckeditorOptions = {
        readOnly: true,
        extraPlugins: 'sharedspace',
        sharedSpaces: {
          top: 'ckeditor-toolbar'
        },
        extraAllowedContent: 'div;*[class](*){*}'
      };

      $scope.scriptLoaded = true;
    });

    $scope.$on('$locationChangeStart', function (evt) {
      evt.preventDefault();
      $modalInstance.dismiss('locationChange');
    });
  });
