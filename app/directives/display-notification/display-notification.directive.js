/**
 * Created by Jairo on 19/07/2015.
 */
angular.module('DisplayNotificationDirectiveModule', [])
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

        scope.$on('$locationChangeStart',function(event, toState, toParams, fromState, fromParams){
          el.modal('hide');
          event.preventDefault();
        });

        //scope.print = function () {
        //  var document = window.document;
        //  var printSection = document.getElementById('printSection');
        //  if (printSection === null) {
        //    printSection = document.createElement('div');
        //    printSection.id = 'printSection';
        //    document.body.appendChild(printSection);
        //  } else {
        //    printSection.innerHTML = '';
        //  }
        //
        //  var divToPrint = document.getElementById('printContent');
        //
        //  var cloneDiv = divToPrint.cloneNode(true);
        //  printSection.appendChild(cloneDiv);
        //
        //  window.print();
        //
        //}

      }
    }

  }
);
