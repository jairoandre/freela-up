'use strict';

angular
  .module('ReportsSendNotificationsModalControllerModule', [])

  .controller('ReportsSendNotificationsModalController', function ($scope, $modalInstance, Restangular, $q, report, $log) {

    $log.info('ReportsSendNotificationsModalController created.');
    $scope.$on('$destroy', function () {
      $log.info('ReportsSendNotificationsModalController destroyed.');
    });

    window.scope = $scope;

    var categoryId = report.category.id;

    $scope.orderedNotifications = report.category.ordered_notifications;

    $scope.last_notification_id = report.last_notification_id = 2;

    $scope.showTable = false;

    // TODO: Remover
    var dummyNotifications = function (categoryId, statuses, deadline, ammount) {
      var dummys = [];
      for (var i = 0; i < ammount; i++) {
        dummys[i] = {
          "id": i,
          "reports_categories_id": categoryId,
          "order": i,
          "title": "Notificação " + i,
          "reports_status_id": statuses[i] ? statuses[i].id : '',
          "default_deadline_in_days": deadline,
          "layout": "..." // Leiaute em HTML com os placeholders
        };
      }
      return dummys;
    };

    var dummyItemNotifications = function (ammount) {
      var dummys = [];
      for (var i = 0; i < ammount; i++) {
        dummys[i] = {
          "id": i,
          "reports_item_id": report.id,
          "reports_notification_type_id": i,
          "deadline_in_days": 45,
          "content": "...",
          "created_at": "2015-0" + (i + 5) + "-16T19:20:30-03:00"
        };
      }
      return dummys;
    };

    // Mapeamento para facilitar renderização de elementos de tela.
    $scope.statusesMap = {};

    var statusesPromise = Restangular.one('reports').one('categories', categoryId).all('statuses').getList();
    statusesPromise.then(function (r) {
      $scope.statuses = r.data;
      // TODO: Remover
      $scope.notifications = dummyNotifications(categoryId, $scope.statuses, 20, 6);
      $scope.itemNotifications = dummyItemNotifications(3);
      $scope.showTable = true;
      $scope.refreshNotifications();
      for (var i = 0; i < $scope.statuses.length; i++) {
        var _s = $scope.statuses[i];
        $scope.statusesMap[_s.id] = _s;
      }
      $log.info($scope.statusesMap);
    });


    $scope.refreshNotifications = function () {
      $scope.notificationsMap = {};
      $scope.itemNotificationsMap = {};

      for (var i = 0; i < $scope.itemNotifications.length; i++) {
        var _in = $scope.itemNotifications[i];
        $scope.itemNotificationsMap[_in.reports_notification_type_id] = _in;
        if($scope.last_notification_id === _in.id){
          $scope.last_notification_type_id = _in.reports_notification_type_id;
        }
      }

      // Complementa o array de notificações com informações pertinentes ao modal.

      $scope.currentNotificationOrder = 0;

      for (var i = 0; i < $scope.notifications.length; i++) {
        var _n = $scope.notifications[i];
        _n.remaining_days = '-';
        _n.show_send_btn = true;
        _n.send_btn_label = 'Emitir';
        _n.disable_send_btn = false;

        $scope.notificationsMap[_n.id] = _n;


        // Verifica se a notificação iterada ja foi emitida
        if ($scope.itemNotificationsMap[_n.id]) {
          // Armazena a data de criação do item de notificação para exibição em tela
          _n.created_at = $scope.itemNotificationsMap[_n.id].created_at;
          _n.send_btn_label = 'Reemitir';
          calculateRemaningDays(_n);
        }
      }

      verifyOrderedNotifications();


    }

    var verifyOrderedNotifications = function() {
      // Se a categoria de relato for de notificações ordenadas
      if ($scope.orderedNotifications) {
        if ($scope.last_notification_type_id) {
          var last_notification_type = $scope.notificationsMap[$scope.last_notification_type_id];

          var nextOrder = last_notification_type.order;

          if($scope.remaining_days === 'Encerrado'){
            nextOrder += 1;
          }

          for(var i = 0 ; i < $scope.notifications.length ; i++){
            if($scope.notifications[i].order < nextOrder){
              $scope.notifications[i].show_send_btn = false;
            }else if($scope.notifications[i].order > nextOrder){
              $scope.notifications[i].disable_send_btn = true;
            }
          }
        }
      }
    }

    var calculateRemaningDays = function (notification) {
      if (notification.created_at) {
        notification.remaining_days = notification.default_deadline_in_days - Math.floor((new Date() - new Date(notification.created_at)) / (1000 * 60 * 60 * 24));
        // Prazo Restante
        if (notification.remaining_days < 0) {
          notification.remaining_days = 'Encerrado';
        } else {
          notification.remaining_days += ' dia' + (notification.remaining_days === 1 ? '' : 's');
        }
      } else {
        notification.remaining_days = '-';
      }
    }


    $scope.callEndPoints = function () {
      $log.info('Acionando endpoints da API.');

      // GET /reports/items/:id/notifications
      var reportItemNotificationsPromise = Restangular
        .one('reports')
        .one('items', report.id)
        .all('notifications')
        .getList({
          return_fields: 'id,reports_notification_type_id,deadline_in_days,content,created_at,updated_at,overdue_at,days_to_deadline'
        });

      // GET /reports/categories/:id/notification_types
      var notificationsPromise = Restangular.
        one('reports').
        one('categories', categoryId).
        all('notification_types').
        getList({
          return_fields: 'id,reports_categories_id,title,reports_status_id,default_deadline_in_days,layout,created_at,updated_at'
        });


      $q.all(notificationsPromise, reportItemNotificationsPromise).then(function (responses) {
        $scope.notifications = responses[0].data;
        $scope.itemNotifications = responses[1].data;
        $log.info($scope.notifications);
        $log.info($scope.itemNotifications);
        refreshNotifications();
        if (notifications) {
          $scope.notifications.sort(function (a, b) {
            return a.order > b.order;
          });
        }
      });
    }

    $scope.close = function () {
      $modalInstance.close();
    };

    window.orderedItens = function () {
      $scope.orderedNotifications = true;
      $scope.refreshNotifications();
    }

  });
