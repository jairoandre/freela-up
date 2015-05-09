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
    'duScroll'
  ])

  .value('duScrollOffset', 200)

  .controller('ReportsShowController', function ($scope, Restangular, $q, $modal, $window, reportResponse, feedbackResponse, commentsResponse, $rootScope) {
    $scope.report = reportResponse.data;
    $scope.report.status_id = $scope.report.status.id; // jshint ignore:line
    $scope.feedback = feedbackResponse.data;
    $scope.comments = commentsResponse.data;

    $scope.images = [];

    for (var c = $scope.report.images.length - 1; c >= 0; c--) {
      $scope.images.push({versions: $scope.report.images[c]});
    };

    $scope.newUserResponse = { message: null, privateComment: true, typing: false };
    $scope.newSystemComment = { message: null, typing: false };

    $scope.filterByUserMessages = function(comment) {
      return (comment.visibility === 0 || comment.visibility === 1);
    };

    var sendComment = function(message, visibility) {
      return Restangular.one('reports', $scope.report.id).customPOST({ message: message, visibility: visibility }, 'comments');
    };

    $scope.submitUserResponse = function() {
      $scope.processingComment = true;

      var visibility = 0;

      if ($scope.newUserResponse.privateComment) visibility = 1;

      var postCommentResponse = sendComment($scope.newUserResponse.message, visibility);

      postCommentResponse.then(function(response) {
        $scope.newUserResponse.message = null;
        $scope.processingComment = false;

        $scope.comments.push(response.data);

        $scope.refreshHistory();
      });
    };

    $scope.submitSystemComment = function() {
      $scope.processingSystemComment = true;

      var postCommentResponse = sendComment($scope.newSystemComment.message, 2);

      postCommentResponse.then(function(response) {
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
          report: function() {
            return $scope.report;
          },

          category: function() {
            return $scope.report.category;
          },

          categories: function() {
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
          report: function() {
            return report;
          },

          category: function() {
            return category;
          },

          statusesResponse: function() {
            return Restangular.one('reports').one('categories', $scope.report.category.id).all('statuses').getList();
          }
        },
        controller: 'ReportsEditStatusModalController'
      });
    };

    $scope.editAddress = function () {
      var mapModalInstance =  $modal.open({
        templateUrl: 'modals/reports/select-address/reports-select-address.template.html',
        windowClass: 'mapModal',
        resolve: {
          category: function() {
            return $scope.report.category;
          },

          report: function() {
            return $scope.report;
          }
        },
        controller: 'ReportsSelectAddressModalController'
      });

      mapModalInstance.opened.then(function () {
        setTimeout(function() {
          $rootScope.selectLatLngMap.start();
        }, 80);
      });
    };

    $scope.editDescription = function () {
      $modal.open({
        templateUrl: 'modals/reports/edit-description/reports-edit-description.template.html',
        windowClass: 'editReportModal',
        resolve: {
          report: function() {
            return $scope.report;
          },

          refreshHistory: function() {
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
          report: function() {
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
          report: function() {
            return $scope.report;
          },

          category: function() {
            return $scope.report.category;
          },

          groupsResponse: function() {
            return Restangular.all('groups').getList({ return_fields: 'id,name'});
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
          setUser: ['Restangular', '$state', '$rootScope', function(Restangular, $state, $rootScope) {
            return function(user) {
              $rootScope.resolvingRequest = true;

              var changeStatusPromise = Restangular.one('reports', $scope.report.category.id).one('items', $scope.report.id).one('assign').customPUT({ 'user_id': user.id });

              changeStatusPromise.then(function() {
                $rootScope.resolvingRequest = false;

                $scope.showMessage('ok', 'O usuário responsável foi alterado com sucesso.', 'success', true);
                $state.go($state.current, {}, {reload: true});
              });
            };
          }],

          filterByGroup: function() {
            return $scope.report.assigned_group.id;
          }
        },
        controller: 'ReportsSelectUserModalController'
      });
    };

    $scope.print = function() {
      $modal.open({
        templateUrl: 'modals/reports/print/reports-print.template.html',
        windowClass: 'filterCategoriesModal',
        resolve: {
          openModal: function() {
            return function(options) {
              $window.open('#/reports/' + $scope.report.id + '/print?sections=' + options.join(), 'ZUP Imprimir relato', 'height=800,width=800');
            }
          }
        },
        controller: 'ReportsPrintModalController'
      });
    };

    // report's history
    $scope.refreshHistory = function() {
      var options = { return_fields: 'changes,created_at,kind,user.id,user.name'},
          selectedFilters = $scope.selectedFilters();

      if (selectedFilters.length !== 0) options.kind = selectedFilters.join();

      if ($scope.historyFilterBeginDate) options['created_at[begin]'] = $scope.historyFilterBeginDate;
      if ($scope.historyFilterEndDate) options['created_at[end]'] = $scope.historyFilterEndDate;

      $scope.loadingHistoryLogs = true;

      var historyPromise = Restangular.one('reports').one('items', $scope.report.id).one('history').getList(null, options);

      historyPromise.then(function(historyLogs) {
        $scope.historyLogs = historyLogs.data;

        $scope.loadingHistoryLogs = false;
      });
    };

    $scope.historyOptions = { type: undefined };
    $scope.availableHistoryFilters = [
      { type: 'category', name: 'Categoria', selected: false },
      { type: 'status', name: 'Estados', selected: false },
      { type: 'address', name: 'Endereço', selected: false },
      { type: 'description', name: 'Descrição', selected: false },
      { type: 'category', name: 'Categoria', selected: false },
    ];

    $scope.availableHistoryDateFilters = [
      { name: 'Hoje', beginDate: moment().startOf('day').format(), endDate: moment().endOf('day').format(), selected: false },
      { name: 'Ontem', beginDate: moment().subtract(1, 'days').startOf('day').format(), endDate: moment().subtract(1, 'days').endOf('day').format(), selected: false },
      { name: 'Este mês', beginDate: moment().startOf('month').format(), endDate: moment().subtract(1, 'days').endOf('day').format(), selected: false },
      { name: 'Mês passado', beginDate: moment().subtract(1, 'months').startOf('month').format(), endDate: moment().subtract(1, 'months').subtract(1, 'days').endOf('day').format(), selected: false },
      { name: 'Todos', beginDate: null, endDate: null, selected: true }
    ];

    $scope.selectedFilters = function() {
      var filters = [];

      _.each($scope.availableHistoryFilters, function(filter) {
        if (filter.selected) filters.push(filter.type);
      });

      return filters;
    };

    $scope.toggleOption = function(option) {
      option.selected = !option.selected;

      $scope.refreshHistory();
    };

    $scope.resetHistoryFilters = function() {
      _.each($scope.availableHistoryFilters, function(filter) {
        filter.selected = true;
      });

      $scope.refreshHistory();
    };

    $scope.showCustomDateFields = function() {
      _.each($scope.availableHistoryDateFilters, function(filter) {
        filter.selected = false;
      });

      $scope.showCustomDateHelper = true;
    };

    $scope.selectDateFilter = function(filter) {
      _.each($scope.availableHistoryDateFilters, function(filter) {
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
  });
