'use strict';

angular
  .module('ReportsSendNotificationsModalControllerModule', [])

  .controller('ReportsSendNotificationsModalController', function ($scope, $modalInstance, Restangular, $q, $log, report, notifications) {

    $log.info('ReportsSendNotificationsModalController created.');
    $scope.$on('$destroy', function () {
      $log.info('ReportsSendNotificationsModalController destroyed.');
    });

    window.scope = $scope;

    $scope.notifications = notifications;

    // Mapeamento para facilitar renderização de elementos de tela.
    $scope.statusesMap = {};

    var statuses = report.category.statuses;

    for (var i = 0; i < statuses.length; i++) {
      var _s = statuses[i];
      $scope.statusesMap[_s.id] = _s;
    }

    $scope.close = function () {
      $modalInstance.close();
    };

  }
)
;
