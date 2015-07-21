/**
 * Created by Jairo on 19/07/2015.
 */
angular.module('DeleteModalDirectiveModule', [])
  .directive('deleteModal', function () {
    return {
      restrict: 'A',
      transclude: true,
      replace: true,
      scope: {
        ngModel: '=',
        modalConfirmFunction: '&',
        modalConfirmPromise: '='
      },
      templateUrl: 'directives/delete-modal/delete-modal.template.html',
      link: function(scope, el, attrs){
        scope.modalId = attrs.modalId;
        scope.modalTitle = attrs.modalTitle;
        scope.modalCustomMsg = attrs.modalCustomMsg;
        scope.modalItemTitle = attrs.modalItemTitle;
      }
    }

  }
);
