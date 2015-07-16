'use strict';

angular
  .module('ReportsSendNotificationsModalControllerModule', [])

  .controller('ReportsSendNotificationsModalController', function ($scope, $modalInstance, Restangular, report, $log) {

    var categoryId = report.category.id;
    $scope.showTable = true;
    $log.info('Realizando busca de notificações para a categoria: ' + categoryId);

    $scope.notifications = [
      {
        "id": 1,
        "order": 1,
        "reports_categories_id": 1,
        "title": "Tipo de notificação 1",
        "reports_status_id": 19,
        "default_deadline_in_days": 45,
        "layout": "...", // Leiaute em HTML com os placeholders
        "created_at": "2015-06-16T19:20:30-03:00",
        "updated_at": "2015-06-16T19:20:30-03:00"
      },
      {
        "id": 2,
        "order": 2,
        "reports_categories_id": 1,
        "title": "Tipo de notificação 2",
        "reports_status_id": 20,
        "default_deadline_in_days": 45,
        "layout": "...", // Leiaute em HTML com os placeholders
        "created_at": "2015-07-01T19:20:30-03:00",
        "updated_at": "2015-07-01T19:20:30-03:00"
      },
      {
        "id": 3,
        "order": 3,
        "reports_categories_id": 1,
        "title": "Tipo de notificação 3",
        "reports_status_id": 20,
        "default_deadline_in_days": 45,
        "layout": "...", // Leiaute em HTML com os placeholders
        "created_at": "2015-07-10T19:20:30-03:00",
        "updated_at": "2015-07-10T19:20:30-03:00"
      },
      {
        "id": 3,
        "order": 4,
        "reports_categories_id": 1,
        "title": "Tipo de notificação 4",
        "reports_status_id": '',
        "default_deadline_in_days": 45,
        "layout": "...", // Leiaute em HTML com os placeholders
        "created_at": '',
        "updated_at": "2015-07-10T19:20:30-03:00"
      },
      {
        "id": 3,
        "order": 5,
        "reports_categories_id": 1,
        "title": "Tipo de notificação 5",
        "reports_status_id": 19,
        "default_deadline_in_days": 45,
        "layout": "...", // Leiaute em HTML com os placeholders
        "created_at": "2015-07-10T19:20:30-03:00",
        "updated_at": "2015-07-10T19:20:30-03:00"
      },
      {
        "id": 3,
        "order": 6,
        "reports_categories_id": 1,
        "title": "Tipo de notificação 6",
        "reports_status_id": 20,
        "default_deadline_in_days": 45,
        "layout": "...", // Leiaute em HTML com os placeholders
        "created_at": "2015-07-10T19:20:30-03:00",
        "updated_at": "2015-07-10T19:20:30-03:00"
      }
    ];

    $scope.statusesMap = {};

    var statusesPromise = Restangular.one('reports').one('categories', categoryId).all('statuses').getList();
    statusesPromise.then(function(r){
      $scope.statuses = r.data;
      for(var i = 0; i < $scope.statuses.length ; i++){
        var _s = $scope.statuses[i];
        $scope.statusesMap[_s.id]=_s;
      }
      $log.info($scope.statusesMap);
    });



    // Complementa o array de notificações com informações pertinentes ao modal.
    for(var i = 0 ; i < $scope.notifications.length; i++){
      var _n = $scope.notifications[i]
      if(_n.created_at){
        _n.remaining_days = _n.default_deadline_in_days - Math.floor((new Date() - new Date(_n.created_at))/(1000*60*60*24));
        // Prazo Restante
        if(_n.remaining_days < 0){
          _n.remaining_days = 'Encerrado';
        }else{
          _n.remaining_days += ' dia' + (_n.remaining_days === 1 ? '' : 's');
        }
      }else{
        _n.remaining_days = '-';
      }
    }


    if(false){
      Restangular.one('reports').one('categories', categoryId).all('notification_types').getList({
        return_fields: 'title,default_deadline_in_days,layout,order,reports_status_id'
      }).then(function (response) {
        var notifications = $scope.notifications = response.data;

        $scope.showTable = true;

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

  });
