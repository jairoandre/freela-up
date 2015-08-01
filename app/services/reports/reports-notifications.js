'use strict';

/**
 * Provides an API client for the reports categories from ZUP API
 * @module ReportsCategoriesService
 */
angular
  .module('ReportsCategoriesNotificationsServiceModule', [])
  .factory('ReportsCategoriesNotificationsService', function (Restangular, $q, $log) {

    function ReportsCategoriesNotificationsService() {

      var self = this;

      self.notificationTypesMap = {};

      self.reportNotificationTypes = {};

      self.cleanCache = function () {
        self.notificationTypesMap = {};
      }

      self.getLastNotification = function(reportId, categoryId) {

        var returnFields = [
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

        return Restangular
          .one('reports')
          .one('categories', categoryId)
          .one('items', reportId)
          .one('notifications')
          .one('last').customGET(null, {return_fields : returnFields.join()});

      };

      self.getAvailableNotificationsForReport = function (reportId, categoryId) {

        var returnFields = [
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

        var deferred = $q.defer();

        if (self.reportNotificationTypes[reportId]) {
          deferred.resolve(self.reportNotificationTypes[reportId]);
        } else {
          Restangular
            .one('reports')
            .one('categories', categoryId)
            .one('items', reportId)
            .getList('notifications',{return_fields : returnFields.join()})
            .then(function(r){
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

      self.getNotificationTypesArrayForCategory = function (categoryId) {

        var deferred = $q.defer();

        if (self.notificationTypesMap[categoryId]) {
          deferred.resolve(self.notificationTypesMap[categoryId]);
        } else {
          Restangular.one('reports')
            .one('categories', categoryId)
            .all('notification_types')
            .getList({return_fields: returnFields.join()})
            .then(function (r) {
              self.notificationTypesMap[categoryId] = r.data;
              deferred.resolve(r.data);
            }, function (r) {
              deferred.reject(r);
            });
        }

        return deferred.promise;

      };

      self.saveNotificationType = function (categoryId, notificationType) {
        return Restangular
          .one('reports')
          .one('categories', categoryId)
          .withHttpConfig({treatingErrors: true})
          .post('notification_types', notificationType);
      };

      self.updateNotificationType = function (categoryId, notificationType) {
        return Restangular
          .one('reports')
          .one('categories', categoryId)
          .one('notification_types', notificationType.id)
          .withHttpConfig({treatingErrors: true})
          .customPUT(notificationType);
      };

      self.deleteNotificationType = function (categoryId, notificationType) {
        return Restangular
          .one('reports')
          .one('categories', categoryId)
          .one('notification_types', notificationType.id)
          .remove();
      }

    }

    return new ReportsCategoriesNotificationsService();

  });
