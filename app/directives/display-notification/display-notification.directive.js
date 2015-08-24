/**
 * Created by Jairo on 19/07/2015.
 */
angular.module('DisplayNotificationDirectiveModule', ['ZupPrintDirectiveModule'])
  .directive('displayNotification', function ($modal) {
    return {
      restrict: 'A',
      scope: {
        displayNotification: '&'
      },
      link: function (scope, el, attrs) {
        var fncHandler = function (evt) {
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
          evt.preventDefault();
        };
        el.on('click', function (evt) {
          fncHandler(evt);
        });
        el.off('click', function (evt) {
          fncHandler(evt);
        });
      }
    }
  })
  .controller('DisplayNotificationModalCtrl', function ($scope, $modalInstance, content) {
    $scope.content = content;
    $scope.close = function () {
      $modalInstance.close();
    };
    $scope.$on('$locationChangeStart', function (evt) {
      $modalInstance.dismiss('locationChange');
      evt.preventDefault();
    });
  });
