'use strict';

angular
  .module('ReportsSendNotificationsModalControllerModule', ['ReportsCategoriesNotificationsServiceModule'])

  .controller('ReportsSendNotificationsModalController', function ($scope, $modalInstance, Restangular, $q, $log, $http, parentScope, report, notifications, ReportsCategoriesNotificationsService) {

    $log.info('ReportsSendNotificationsModalController created.');
    $scope.$on('$destroy', function () {
      $log.info('ReportsSendNotificationsModalController destroyed.');
    });

    window.scope = $scope;

    $scope.notifications = notifications;

    $scope.confirmSendMap = {};

    $scope.notificationPromises = {};

    for (var i = 0, l = notifications.length; i < l; i++) {
      $scope.confirmSendMap[notifications[i]] = false;
    }

    // Status map to help the rendering elemments.
    $scope.statusesMap = {};

    var statuses = report.category.statuses;

    for (var i = 0, l = statuses.length; i < l; i++) {
      var _s = statuses[i];
      $scope.statusesMap[_s.id] = _s;
    }


    /**
     * Prepare the send/resend button for notification.
     * @param notification
     */
    $scope.send = function (notification) {
      $scope.confirmSendMap[notification.notification_type.id] = true;
    };

    /**
     * Send/Resend a notification.
     * @param notification
     */
    $scope.confirmSend = function (notification) {
      $scope.notificationPromises[notification.notification_type.id] = ReportsCategoriesNotificationsService
        .sendNotification(report.id, report.category.id, notification.notification_type)
        .then(function () {
          $scope.confirmSendMap[notification.notification_type.id] = false;
          notification.sent = true;
          ReportsCategoriesNotificationsService.cleanCache();
          ReportsCategoriesNotificationsService.getAvailableNotificationsForReport(report.id, report.category.id)
            .then(function (r) {
              $scope.notifications = r;
            });
          //ReportsCategoriesNotificationsService.getLastNotification(report.id, report.category.id)
          //  .then(function(r) {
          //    parentScope.lastNotification = r.data;
          //});
        });
    }

    $scope.close = function () {
      $modalInstance.close();
    };

  }
)
;
