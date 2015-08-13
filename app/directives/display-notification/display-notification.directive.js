/**
 * Created by Jairo on 19/07/2015.
 */
angular.module('DisplayNotificationDirectiveModule', ['ZupPrintDirectiveModule'])
  .directive('displayNotification', function () {
    return {
      restrict: 'E',
      scope: {
        ngModel: '=',
        content: '='
      },
      templateUrl: 'directives/display-notification/display-notification.template.html',
      link: function (scope, el, attrs) {

        scope.modalId = attrs.modalId;

        scope.$on('$locationChangeStart', function (event, toState, toParams, fromState, fromParams) {
          el.modal('hide');
          event.preventDefault();
        });

      }
    }

  }
);
