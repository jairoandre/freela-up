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
        "reports_notification_type_id",
        "deadline_in_days",
        "content",
        "sent",
        "able_to_send",
        "days_to_deadline",
        "created_at",
        "updated_at",
        "overdue_at"
      ];

      self.getLastNotification = function(reportId, categoryId) {

        $log.info('Retrieving last notification for report [id=' + reportId + ']');

        return Restangular
          .one('reports')
          .one('categories', categoryId)
          .one('items', reportId)
          .one('notifications')
          .customGET('last', {return_fields : notificationReturnFields.join()});

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
            .getList('notifications',{return_fields : notificationReturnFields.join()})
            .then(function(r){
              $log.info('Notification info from rest.');
              var array = r.data;
              var onlyActives = [];
              var j = 0;
              for(var i = 0; i < array.length; i++){
                if(array[i].notification_type.active){
                  onlyActives[j++] = array[i];
                }
              }
              self.reportNotificationTypes[reportId] = onlyActives;
              deferred.resolve(onlyActives);
            });
        }
        return deferred.promise;
      };

      self.sendNotification = function(reportId, categoryId, notificationType){
        $log.info('Send notification [categoryId: ' + categoryId + ', reportId: ' + reportId + ', notificationTypeId: ' + notificationType.id + ']');
        return Restangular
          .one('reports')
          .one('categories', categoryId)
          .one('items', reportId)
          .withHttpConfig({treatingErrors: false})
          .post('notifications',{notification_type_id: notificationType.id, deadline_in_days: notificationType.default_deadline_in_days });
      };

    }

    return new ReportsCategoriesNotificationsService();

  });
