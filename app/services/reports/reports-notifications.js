'use strict';

/**
 * Provides an API client for the reports notifications from ZUP API
 * @module ReportsCategoriesService
 * @author Jairo André (jairo.andre@gmail.com)
 */
angular
  .module('ReportsCategoriesNotificationsServiceModule', [])
  .factory('ReportsCategoriesNotificationsService', function (Restangular, $q, $log) {

    function ReportsCategoriesNotificationsService() {
      this.notificationTypesMap = {};
      this.reportNotificationTypes = {};
    }

    ReportsCategoriesNotificationsService.notificationReturnFields = [
      "id",
      "user_id",
      "reports_item_id",
      "notification_type.id",
      "notification_type.title",
      "notification_type.active",
      "notification_type.default_deadline_in_days",
      "deadline_in_days",
      "content",
      "sent",
      "able_to_send",
      "days_to_deadline",
      "created_at",
      "updated_at",
      "overdue_at"
    ];

    ReportsCategoriesNotificationsService.prototype.cleanCache = function () {
      $log.info('Cleaning notification cache.');
      this.notificationTypesMap = {};
      this.reportNotificationTypes = {};
    };

    ReportsCategoriesNotificationsService.prototype.getLastNotification = function (reportId, categoryId) {

      $log.info('Retrieving last notification for report [id=' + reportId + ']');

      var deferred = $q.defer();

      Restangular
        .one('reports')
        .one('categories', categoryId)
        .one('items', reportId)
        .one('notifications')
        .customGET('last',{return_fields: ReportsCategoriesNotificationsService.notificationReturnFields.join()}).then(function(r){
          deferred.resolve(r.data);
        });

      return deferred.promise;
    };

    ReportsCategoriesNotificationsService.prototype.getAvailableNotificationsForReport = function (reportId, categoryId) {
      $log.info('Retrieving notifications for report [id=' + reportId + ']');

      var deferred = $q.defer();

      if (this.reportNotificationTypes[reportId]) {
        $log.info('Notification info from cache.');
        deferred.resolve(this.reportNotificationTypes[reportId]);
      } else {
        Restangular
          .one('reports')
          .one('categories', categoryId)
          .one('items', reportId)
          .getList('notifications', {return_fields: ReportsCategoriesNotificationsService.notificationReturnFields.join()})
          .then(function (r) {
            $log.info('Notification info from rest.');
            var array = r.data;
            var onlyActives = [];
            var j = 0;
            for (var i = 0, l = array.length; i < l; i++) {
              if (array[i].notification_type.active) {
                onlyActives[j++] = array[i];
              }
            }
            this.reportNotificationTypes[reportId] = onlyActives;
            deferred.resolve(onlyActives);
          }.bind(this));
      }
      return deferred.promise;
    };

    ReportsCategoriesNotificationsService.prototype.sendNotification = function (reportId, categoryId, notificationTypeId) {
      $log.info('Send notification [categoryId: ' + categoryId + ', reportId: ' + reportId + ', notificationTypeId: ' + notificationTypeId + ']');
      return Restangular
        .one('reports')
        .one('categories', categoryId)
        .one('items', reportId)
        .withHttpConfig({treatingErrors: false})
        .post('notifications', {
          notification_type_id: notificationTypeId
        });
    };

    ReportsCategoriesNotificationsService.prototype.resendNotification = function (reportId, categoryId, notificationId) {
      // reports/categories/:categoryId/items/:reportId/notifications/:notificationId/resend
      $log.info('Send notification [categoryId: ' + categoryId + ', reportId: ' + reportId + ', notificationId: ' + notificationId + ']');
      return Restangular
        .one('reports')
        .one('categories', categoryId)
        .one('items', reportId)
        .one('notifications', notificationId)
        .one('resend')
        .withHttpConfig({treatingErrors: false})
        .put();
    };

    ReportsCategoriesNotificationsService.prototype.restartProcess = function(reportId, categoryId) {
      $log.info('Restart process for report [categoryId: ' + categoryId + ', reportId: ' + reportId + ']');
      return Restangular
        .one('reports')
        .one('categories', categoryId)
        .one('items', reportId)
        .one('notifications')
        .one('restart')
        .withHttpConfig({treatingErrors: false})
        .put();
    };

    return new ReportsCategoriesNotificationsService();
  });
