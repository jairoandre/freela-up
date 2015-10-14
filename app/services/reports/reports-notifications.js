'use strict';

/**
 * Provides an API client for the reports notifications from ZUP API
 * @module ReportsCategoriesService
 * @author Jairo André (jairo.andre@gmail.com)
 */
angular
  .module('ReportsCategoriesNotificationsServiceModule', [])
  .factory('ReportsCategoriesNotificationsService', function (Restangular, FullResponseRestangular, $rootScope, $q, $log) {

    var service = {};

    service.notificationTypesMap = {};
    service.reportNotificationTypes = {};
    service.notifications = {};
    service.total = 0;

    service.notificationReturnFields = [
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

    service.cleanCache = function () {
      $log.info('Cleaning notification cache.');
      service.notificationTypesMap = {};
      service.reportNotificationTypes = {};
      service.notifications = {};
      service.total = 0;
    };

    service.getLastNotification = function (reportId, categoryId) {

      $log.info('Retrieving last notification for report [id=' + reportId + ']');

      var deferred = $q.defer();

      Restangular
        .one('reports')
        .one('categories', categoryId)
        .one('items', reportId)
        .one('notifications')
        .customGET('last', {return_fields: service.notificationReturnFields.join()}).then(function (r) {
          deferred.resolve(r.data);
        });

      return deferred.promise;
    };

    service.getAvailableNotificationsForReport = function (reportId, categoryId) {
      $log.info('Retrieving notifications for report [id=' + reportId + ']');

      var deferred = $q.defer();

      if (service.reportNotificationTypes[reportId]) {
        $log.info('Notification info from cache.');
        deferred.resolve(service.reportNotificationTypes[reportId]);
      } else {
        Restangular
          .one('reports')
          .one('categories', categoryId)
          .one('items', reportId)
          .getList('notifications', {return_fields: service.notificationReturnFields.join()})
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
            service.reportNotificationTypes[reportId] = onlyActives;
            deferred.resolve(onlyActives);
          });
      }
      return deferred.promise;
    };

    service.sendNotification = function (reportId, categoryId, notificationTypeId) {
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

    service.resendNotification = function (reportId, categoryId, notificationId) {
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

    service.restartProcess = function (reportId, categoryId) {
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

    service.searchNotifications = function (options) {
      $log.info('Searching notifications');

      var defaultOptions = {
        display_type : 'full',
        return_fields : [
          'id',
          'deadline_in_days',
          'days_to_deadline',
          'created_at',
          'active',
          'item.id',
          'item.address',
          'user.name',
          'notification_type.id',
          'notification_type.title',
          'category.id',
          'category.name'].join()
      };

      angular.merge(defaultOptions,options);

      var promise = FullResponseRestangular
        .one('search')
        .all('reports')
        .all('notifications')
        .customGET(null, options);

      var deferred = $q.defer();

      promise.then(function (resp) {
        _.each(resp.data.notifications, function (r) {
          service.notifications[r.id] = r;
        });
        deferred.resolve(service.notifications);
        service.total = parseInt(resp.headers().total, 10);
        $rootScope.$broadcast('notificationsFetched');
      });

      return deferred.promise;
    };


    return service;
  });
