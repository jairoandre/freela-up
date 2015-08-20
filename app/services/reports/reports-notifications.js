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

      var self = this;

      self.notificationTypesMap = {};

      self.reportNotificationTypes = {};

      self.cleanCache = function () {
        $log.info('Cleaning notification cache.')
        self.notificationTypesMap = {};
        self.reportNotificationTypes = {};
      }

      var notificationReturnFields = [
        "id",
        "user_id",
        "reports_item_id",
        "notification_type.id",
        "notification_type.title",
        "notification_type.active",
        "deadline_in_days",
        "content",
        "sent",
        "able_to_send",
        "days_to_deadline",
        "created_at",
        "updated_at",
        "overdue_at"
      ];

      self.getLastNotification = function (reportId, categoryId) {

        $log.info('Retrieving last notification for report [id=' + reportId + ']');

        var deferred = $q.defer();

        Restangular
          .one('reports')
          .one('categories', categoryId)
          .one('items', reportId)
          .one('notifications')
          .customGET('last',{return_fields: notificationReturnFields.join()}).then(function(r){
            deferred.resolve(r.data);
          });

        return deferred.promise;

      };

      self.getAvailableNotificationsForReport = function (reportId, categoryId) {
        $log.info('Retrieving notifications for report [id=' + reportId + ']');

        var deferred = $q.defer();

        if (self.reportNotificationTypes[reportId]) {
          $log.info('Notification info from cache.');
          deferred.resolve(self.reportNotificationTypes[reportId]);
        } else {
          Restangular
            .one('reports')
            .one('categories', categoryId)
            .one('items', reportId)
            .getList('notifications', {return_fields: notificationReturnFields.join()})
            .then(function (r) {
              $log.info('Notification info from rest.');
              var array = r.data;
              var onlyActives = [];
              var j = 0;
              for (var i = 0; i < array.length; i++) {
                if (array[i].notification_type.active) {
                  onlyActives[j++] = array[i];
                }
              }
              self.reportNotificationTypes[reportId] = onlyActives;
              deferred.resolve(onlyActives);
            });
        }
        return deferred.promise;
      };

      self.sendNotification = function (reportId, categoryId, notificationTypeId) {
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

      self.resendNotification = function (reportId, categoryId, notificationId) {
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

      self.restartProcess = function(reportId, categoryId) {
        $log.info('Restart process for report [categoryId: ' + categoryId + ', reportId: ' + reportId + ']');
        return Restangular
          .one('reports')
          .one('categories', categoryId)
          .one('items', reportId)
          .one('notifications')
          .one('restart')
          .withHttpConfig({treatingErrors: false})
          .put();
      }

    }

    return new ReportsCategoriesNotificationsService();

  });
