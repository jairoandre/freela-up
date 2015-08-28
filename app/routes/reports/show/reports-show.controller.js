'use strict';

angular
  .module('ReportsShowControllerModule', [
    'MapShowReportComponentModule',
    'ReportsEditStatusModalControllerModule',
    'ReportsEditDescriptionModalControllerModule',
    'ReportsEditCategoryModalControllerModule',
    'ReportsSelectAddressModalControllerModule',
    'ReportsForwardModalControllerModule',
    'ReportsSelectUserModalControllerModule',
    'ReportsEditReferenceModalControllerModule',
    'ReportsPrintModalControllerModule',
    'ReportSearchMapComponentModule',
    'MapNewReportComponentModule',
    'NextFieldOnEnterComponentModule',
    'duScroll',
    'ReportsSendNotificationsModalControllerModule',
    'ReportsCategoriesNotificationsServiceModule',
    'ReportsCategoriesServiceModule'
  ])

  .value('duScrollOffset', 200)

  .controller('ReportsShowController', function ($scope, Restangular, $q, $modal, $window, reportResponse, $rootScope, $log, ReportsCategoriesNotificationsService, ReportsCategoriesService) {

    $log.info('ReportsShowController created.');
    $scope.$on('$destroy', function () {
      $log.info('ReportsShowController destroyed.');
    });


    $scope.report = reportResponse.data;
    if ($scope.report.status) {
      $scope.report.status_id = $scope.report.status.id; // jshint ignore:line
    }
    $scope.categoryData = $scope.report.category;
    $scope.images = [];
    $scope.lat = $scope.report.position.latitude; // Please fix this mess whenever possible #TODO
    $scope.lng = $scope.report.position.longitude;

    // Fetch comments
    Restangular.one('reports', $scope.report.id).all('comments').getList({
      return_fields: 'id,created_at,message,visibility,author.id,author.name'
    }).then(function (response) {
      $scope.comments = response.data;
    });

    // Fetch feedback
    Restangular.one('reports', $scope.report.id).one('feedback').get({
      return_fields: 'id,kind,content,images'
    }).then(function (response) {
      $scope.feedback = response.data;
    });

    for (var c = $scope.report.images.length - 1; c >= 0; c--) {
      $scope.images.push({versions: $scope.report.images[c]});
    }

    $scope.newUserResponse = {message: null, privateComment: true, typing: false};
    $scope.newSystemComment = {message: null, typing: false};

    $scope.filterByUserMessages = function (comment) {
      return (comment.visibility === 0 || comment.visibility === 1);
    };

    var sendComment = function (message, visibility) {
      return Restangular.one('reports', $scope.report.id)
        .customPOST({
          message: message,
          visibility: visibility,
          return_fields: 'id,created_at,message,visibility,author.id,author.name'
        }, 'comments');
    };

    $scope.submitUserResponse = function () {
      $scope.processingComment = true;

      var visibility = 0;

      if ($scope.newUserResponse.privateComment) visibility = 1;

      var postCommentResponse = sendComment($scope.newUserResponse.message, visibility);

      postCommentResponse.then(function (response) {
        $scope.newUserResponse.message = null;
        $scope.processingComment = false;

        $scope.comments.push(response.data);

        $scope.refreshHistory();
      });
    };

    $scope.submitSystemComment = function () {
      $scope.processingSystemComment = true;

      var postCommentResponse = sendComment($scope.newSystemComment.message, 2);

      postCommentResponse.then(function (response) {
        $scope.processingSystemComment = false;
        $scope.newSystemComment.message = null;

        $scope.comments.push(response.data);

        $scope.refreshHistory();
      });
    };

    $scope.editCategory = function () {
      $rootScope.resolvingRequest = true;

      $modal.open({
        templateUrl: 'modals/reports/edit-category/reports-edit-category.template.html',
        windowClass: 'report-edit-category-modal',
        resolve: {
          report: function () {
            return $scope.report;
          },

          category: function () {
            return $scope.report.category;
          },

          categories: function () {
            return Restangular.all('reports').all('categories').getList({
              'display_type': 'full',
              'return_fields': 'id,title,subcategories.id,subcategories.title'
            });
          }
        },
        controller: 'ReportsEditCategoryModalController'
      });
    };

    $scope.editReportStatus = function (report, category) {
      $rootScope.resolvingRequest = true;

      $modal.open({
        templateUrl: 'modals/reports/edit-status/reports-edit-status.template.html',
        windowClass: 'editStatusModal',
        resolve: {
          report: function () {
            return report;
          },

          category: function () {
            return category;
          },

          statusesResponse: function () {
            return Restangular.one('reports').one('categories', $scope.report.category.id).all('statuses').getList();
          }
        },
        controller: 'ReportsEditStatusModalController'
      });
    };

    var addressFields = ['address', 'number', 'city', 'postal_code', 'reference', 'state', 'country', 'district'];
    var currentLat = $scope.lat, currentLng = $scope.lng;
    $scope.editAddress = function () {
      $scope.editingAddress = true;
      currentLat = $scope.lat;
      currentLng = $scope.lng;
      $scope.address = {};
      _.each(addressFields, function (ac) {
        $scope.address[ac] = $scope.report[ac];
      });
      $scope.address.number = parseInt($scope.address.number, 10); // TODO upgrade to angular 1.4
    };

    $scope.cancelAddressEdit = function () {
      $scope.editingAddress = false;
      $scope.lat = currentLat;
      $scope.lng = currentLng;
    };

    $scope.saveAddress = function (addressForm) {
      addressForm.$submitted = true;
      if (addressForm.$valid) {
        $scope.savingAddress = true;

        var updateAddressRequest = {
          latitude: $scope.lat,
          longitude: $scope.lng,
          return_fields: 'position.latitude,position.longitude,address,number,reference,district,postal_code,state,city'
        };

        _.each(addressFields, function (field) {
          updateAddressRequest[field] = addressForm[field].$viewValue
        });

        var updateReportAddressPromise = Restangular.one('reports', $scope.report.category.id)
          .one('items', $scope.report.id).customPUT(updateAddressRequest);

        updateReportAddressPromise.then(function (response) {
          var updatedReportFields = response.data;
          $scope.showMessage('ok', 'O endereço do relato foi alterado com sucesso.', 'success', true);
          $scope.loading = $scope.savingAddress = $scope.editingAddress = false;
          $scope.report.position = updatedReportFields.position;
          $scope.lat = $scope.report.position.latitude;
          $scope.lng = $scope.report.position.longitude;
          _.each(addressFields, function (field) {
            $scope.report[field] = updatedReportFields[field]
          });
        });
      }
    };

    $scope.editDescription = function () {
      $modal.open({
        templateUrl: 'modals/reports/edit-description/reports-edit-description.template.html',
        windowClass: 'editReportModal',
        resolve: {
          report: function () {
            return $scope.report;
          },

          refreshHistory: function () {
            return $scope.refreshHistory;
          }
        },
        controller: 'ReportsEditDescriptionModalController'
      });
    };

    $scope.editReference = function () {
      $modal.open({
        templateUrl: 'modals/reports/edit-reference/reports-edit-reference.template.html',
        windowClass: 'editReportModal',
        resolve: {
          report: function () {
            return $scope.report;
          }
        },
        controller: 'ReportsEditReferenceModalController'
      });
    };

    $scope.forwardReport = function () {
      $rootScope.resolvingRequest = true;

      $modal.open({
        templateUrl: 'modals/reports/forward/reports-forward.template.html',
        windowClass: 'reports-forward-modal',
        resolve: {
          report: function () {
            return $scope.report;
          },

          category: function () {
            return $scope.report.category;
          },

          groupsResponse: function () {
            return Restangular.all('groups').getList({return_fields: 'id,name'});
          }
        },
        controller: 'ReportsForwardModalController'
      });
    };

    $scope.assignReport = function () {
      $modal.open({
        templateUrl: 'modals/reports/select-user/reports-select-user.template.html',
        windowClass: 'modal-reports-select-user',
        resolve: {
          setUser: ['Restangular', '$state', '$rootScope', function (Restangular, $state, $rootScope) {
            return function (user) {
              $rootScope.resolvingRequest = true;

              var changeStatusPromise = Restangular.one('reports', $scope.report.category.id).one('items', $scope.report.id).one('assign').customPUT({
                'user_id': user.id,
                'return_fields': ''
              });

              changeStatusPromise.then(function () {
                $rootScope.resolvingRequest = false;

                $scope.showMessage('ok', 'O usuário responsável foi alterado com sucesso.', 'success', true);
                $state.go($state.current, {}, {reload: true});
              });
            };
          }],

          filterByGroup: function () {
            return $scope.report.assigned_group.id;
          }
        },
        controller: 'ReportsSelectUserModalController'
      });
    };

    $scope.print = function () {
      $modal.open({
        templateUrl: 'modals/reports/print/reports-print.template.html',
        windowClass: 'filterCategoriesModal',
        resolve: {
          openModal: function () {
            return function (options) {
              $window.open('#/reports/' + $scope.report.id + '/print?sections=' + options.join(), 'ZUP Imprimir relato', 'height=800,width=850');
            }
          }
        },
        controller: 'ReportsPrintModalController'
      });
    };

    // report's history
    $scope.refreshHistory = function () {
      var options = {return_fields: 'changes,created_at,kind,user.id,user.name'}, selectedFilters = $scope.selectedFilters();

      if (selectedFilters.length !== 0) options.kind = selectedFilters.join();

      if ($scope.historyFilterBeginDate) options['created_at[begin]'] = $scope.historyFilterBeginDate;
      if ($scope.historyFilterEndDate) options['created_at[end]'] = $scope.historyFilterEndDate;

      $scope.loadingHistoryLogs = true;

      var historyPromise = Restangular.one('reports').one('items', $scope.report.id).one('history').getList(null, options);

      historyPromise.then(function (historyLogs) {
        $scope.historyLogs = historyLogs.data;

        // Resolve o texto de estado para mensagem de atraso
        var nextStatus = false;
        for (var i = 0, l = $scope.historyLogs.length; i < l; i++) {
          var log = $scope.historyLogs[i];
          var kind = log.kind;
          if (kind === 'overdue') {
            nextStatus = true;
            continue;
          }
          if (nextStatus && (kind === 'status' || kind === 'creation')) {
            $scope.overdue_status = log.changes.new.title;
            break;
          }
        }

        $scope.loadingHistoryLogs = false;
      });
    };

    $scope.historyOptions = {type: undefined};
    $scope.availableHistoryFilters = [
      {type: 'category', name: 'Categoria', selected: false},
      {type: 'status', name: 'Estados', selected: false},
      {type: 'address', name: 'Endereço', selected: false},
      {type: 'description', name: 'Descrição', selected: false},
      {type: 'category', name: 'Categoria', selected: false},
    ];

    $scope.availableHistoryDateFilters = [
      {
        name: 'Hoje',
        beginDate: moment().startOf('day').format(),
        endDate: moment().endOf('day').format(),
        selected: false
      },
      {
        name: 'Ontem',
        beginDate: moment().subtract(1, 'days').startOf('day').format(),
        endDate: moment().subtract(1, 'days').endOf('day').format(),
        selected: false
      },
      {
        name: 'Este mês',
        beginDate: moment().startOf('month').format(),
        endDate: moment().subtract(1, 'days').endOf('day').format(),
        selected: false
      },
      {
        name: 'Mês passado',
        beginDate: moment().subtract(1, 'months').startOf('month').format(),
        endDate: moment().subtract(1, 'months').subtract(1, 'days').endOf('day').format(),
        selected: false
      },
      {name: 'Todos', beginDate: null, endDate: null, selected: true}
    ];

    $scope.selectedFilters = function () {
      var filters = [];

      _.each($scope.availableHistoryFilters, function (filter) {
        if (filter.selected) filters.push(filter.type);
      });

      return filters;
    };

    $scope.toggleOption = function (option) {
      option.selected = !option.selected;

      $scope.refreshHistory();
    };

    var lastAddress = $scope.report.address, lastNumber = $scope.report.number;
    var wasPositionUpdated = false;
    $scope.fieldOnEnter = function (previousField, currentField) {
      if (previousField.name == 'address' || $scope.address.address == '' || $scope.address.number == '') {
        wasPositionUpdated = false;
        return;
      }
      if ($scope.address.address != lastAddress || $scope.address.number != parseInt(lastNumber, 10)) {
        wasPositionUpdated = true;
        lastAddress = $scope.address.address;
        lastNumber = $scope.address.number;
        $scope.$broadcast('addressChanged');
      }
    };

    $scope.$on('reports:position-updated', function (e, location) {
      $scope.lat = location.lat();
      $scope.lng = location.lng();
      if (!wasPositionUpdated) {
        $scope.$broadcast('addressChanged', true);
      }
    });

    $scope.resetHistoryFilters = function () {
      _.each($scope.availableHistoryFilters, function (filter) {
        filter.selected = true;
      });

      $scope.refreshHistory();
    };

    $scope.showCustomDateFields = function () {
      _.each($scope.availableHistoryDateFilters, function (filter) {
        filter.selected = false;
      });

      $scope.showCustomDateHelper = true;
    };

    $scope.selectDateFilter = function (filter) {
      _.each($scope.availableHistoryDateFilters, function (filter) {
        filter.selected = false;
      });

      filter.selected = !filter.selected;

      $scope.historyFilterBeginDate = filter.beginDate;
      $scope.historyFilterEndDate = filter.endDate;

      $scope.showCustomDateHelper = false;

      $scope.refreshHistory();
    };

    $scope.historyLogs = [];

    $scope.refreshHistory();

    // Notifications
    // Fetch notifications

    var showNotifications = $scope.showNotificationsBtn = $scope.report.category.notifications;

    $scope.getDaysTxt = function(days) {
      return days < 0 ? ('Encerrado há ' + days*-1 + (days === -1 ? ' dia' : ' dias')) : (days + (days === 1 ? ' dia' : ' dias'));
    }

    if (showNotifications) {
      ReportsCategoriesNotificationsService.getLastNotification($scope.report.id, $scope.report.category.id).then(function (r) {
        $scope.lastNotification = r;
      });
    }

    $scope.showNotificationsModal = function () {

      $modal.open({
        templateUrl: 'modals/reports/notifications/reports-notifications-modal.template.html',
        windowClass: 'reports-notifications-modal',
        backdrop: 'static',
        resolve: {
          report: function () {
            return $scope.report;
          },
          notifications: function () {
            $scope.retrieveNotificationsPromise = ReportsCategoriesNotificationsService.getAvailableNotificationsForReport($scope.report.id, $scope.report.category.id);
            return $scope.retrieveNotificationsPromise;
          },
          parentScope: function () {
            return $scope;
          }
        },
        controller: 'ReportsSendNotificationsModalController'
      });
    };


  });
