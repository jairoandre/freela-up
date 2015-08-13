'use strict';

angular
  .module('ReportsSendNotificationsModalControllerModule', ['ReportsCategoriesNotificationsServiceModule'])

  .controller('ReportsSendNotificationsModalController', function ($scope, $modalInstance, Restangular, $q, $log, $http, parentScope, report, notifications, ReportsCategoriesNotificationsService) {

    $log.info('ReportsSendNotificationsModalController created.');
    $scope.$on('$destroy', function () {
      $log.info('ReportsSendNotificationsModalController destroyed.');
    });

    var init = function () {
      $scope.notifications = notifications;
      $scope.confirmSendMap = {};
      $scope.notificationPromises = {};
    };

    init();

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

    var refreshNotifications = function () {
      init();
      ReportsCategoriesNotificationsService.cleanCache();
      ReportsCategoriesNotificationsService.getAvailableNotificationsForReport(report.id, report.category.id)
        .then(function (r) {
          $scope.notifications = r;
        });
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
      var notificationId = notification.notification_type.id;
      if (notification.sent) {
        $scope.notificationPromises[notificationId] = ReportsCategoriesNotificationsService.resendNotification(report.id, report.category.id, notification.id);
      } else {
        $scope.notificationPromises[notificationId] = ReportsCategoriesNotificationsService.sendNotification(report.id, report.category.id, notification.notification_type.id);
      }

      var lastNotificationPromise = ReportsCategoriesNotificationsService.getLastNotification(report.id, report.category.id);
      $q.all($scope.notificationPromises[notificationId], lastNotificationPromise)
        .then(function (r) {
          $scope.addModalMessage('ok', 'Notificação [' + notification.notification_type.title + ']' +  (notification.sent ? ' reemitida': ' emitida'), 'success');
          refreshNotifications();
          parentScope.lastNotification = r.data;
        });
    };

    var daysTxt = function (days) {
      return days + ' dia' + (days > 1 ? 's' : '');
    }

    $scope.getDefaultDeadlineInDaysTxt = function (notification) {
      var deadlineInDays = notification.deadline_in_days;
      return deadlineInDays ? daysTxt(deadlineInDays) : '-';
    };


    $scope.getDaysToDeadlineTxt = function (notification) {
      if (notification.sent) {
        var daysToDeadline = notification.days_to_deadline;
        return daysToDeadline <= 0 ? 'Encerrado' : daysTxt(daysToDeadline);
      } else {
        return '-';
      }
    };

    $scope.restartProcess = function () {
      ReportsCategoriesNotificationsService.restartProcess(report.id, report.category.id).then(function () {
        $scope.addModalMessage('ok', 'Processo reiniciado.', 'success');
        refreshNotifications();
        parentScope.lastNotification = undefined;
      });
    };

    $scope.close = function () {
      $modalInstance.close();
    };

  }
)
;
