/**
 * Created by Jairo on 22/08/2015.
 */
angular.module('ConfirmDialogDirectiveModule', [])
  .directive('confirmDialog', function ($modal) {
    return {
      restrict: 'A',
      scope: {
        cdModalTitle: '@',
        cdWarningMsg: '@',
        cdItemTitle: '&',
        cdConfirmText: '@',
        cdButtonLabel: '@',
        cdConfirmFunction: '&',
        cdConfirmPromise: '='

      },
      link: function (scope, el, attrs) {
        el.on('click', function (evt) {
          $modal.open({
            backdrop: 'static',
            templateUrl: 'directives/confirm-dialog/confirm-dialog.template.html',
            resolve: {
              cdModalTitle: function () {
                return scope.cdModalTitle;
              },
              cdWarningMsg: function () {
                return scope.cdWarningMsg;
              },
              cdItemTitle: function () {
                return scope.cdItemTitle();
              },
              cdConfirmText: function () {
                return scope.cdConfirmText;
              },
              cdButtonLabel: function () {
                return scope.cdButtonLabel;
              },
              cdConfirmPromise: function () {
                return scope.cdConfirmPromise;
              },
              parentScope: function () {
                return scope;
              }
            },
            controller: 'ConfirmDialogCtrl'
          });
          evt.preventDefault();
        });
      }
    }
  })
  .controller('ConfirmDialogCtrl', function ($scope, $modalInstance, $q, $timeout, cdModalTitle, cdWarningMsg, cdItemTitle, cdConfirmText, cdButtonLabel, cdConfirmPromise, parentScope) {
    $scope.cdModalTitle = cdModalTitle;
    $scope.cdWarningMsg = cdWarningMsg;
    $scope.cdItemTitle = cdItemTitle;
    if(cdConfirmText){
      $scope.cdConfirmText = cdConfirmText;
    }else{
      $scope.cdConfirmText = 'DELETAR';
    }

    $scope.cdButtonLabel = cdButtonLabel;
    $scope.cdConfirmPromise = cdConfirmPromise;
    $scope.confirmText = '';

    $scope.close = function () {
      $modalInstance.close();
    };

    $scope.disabled = function () {
      if ($scope.confirmText && angular.equals($scope.confirmText.toLowerCase(), $scope.cdConfirmText)) {
        return false;
      } else {
        return true;
      }
    };

    $scope.confirm = function () {
      parentScope.cdConfirmFunction();
      $modalInstance.close();
    };

    $scope.$on('$locationChangeStart', function (evt) {
      $modalInstance.dismiss('locationChange');
      evt.preventDefault();
    });

  });
