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

    var refreshNotifications = function () {
      init();
      ReportsCategoriesNotificationsService.cleanCache();
      ReportsCategoriesNotificationsService.getAvailableNotificationsForReport(report.id, report.category.id)
        .then(function (r) {
          $scope.notifications = r;
        });
    };


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
      $scope.sendPromise = $q.all($scope.notificationPromises[notificationId], lastNotificationPromise)
        .then(function (r) {
          $scope.addModalMessage('ok', 'Notificação [' + notification.notification_type.title + ']' +  (notification.sent ? ' reemitida': ' emitida'), 'success');
          refreshNotifications();
          parentScope.lastNotification = r.data;
          parentScope.report.status = r.data.current_status;
          parentScope.refreshHistory();
        });
    };

    var daysTxt = function (days) {
      return days + ' dia' + (days > 1 ? 's' : '');
    };

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
      ReportsCategoriesNotificationsService.restartProcess(report.id, report.category.id).then(function (r) {
        $scope.addModalMessage('ok', 'Processo reiniciado.', 'success');
        refreshNotifications();
        // The API returns { message: "...", current_status: { ... } } but we only get data here
        // because there is a response interceptor on main.config that takes the first Object on a given response
        // and makes it the returned value, in that case current_status being the first object
        parentScope.report.status = r.data;
        parentScope.lastNotification = undefined;
        parentScope.refreshHistory();
      });
    };

    $scope.close = function () {
      $modalInstance.close();
    };

  }
);
