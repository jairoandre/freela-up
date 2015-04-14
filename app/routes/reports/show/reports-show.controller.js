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
    'duScroll'
  ])

  .value('duScrollOffset', 200)

  .controller('ReportsShowController', function ($scope, Restangular, $q, $modal, reportResponse, feedbackResponse, categoriesResponse, commentsResponse, $rootScope, reportHistoryResponse) {
    $scope.report = reportResponse.data;
    $scope.report.status_id = $scope.report.status.id; // jshint ignore:line
    $scope.feedback = feedbackResponse.data;
    $scope.comments = commentsResponse.data;

    var categories = categoriesResponse.data;

    // find category
    var findCategory = function() {
      for (var i = categories.length - 1; i >= 0; i--) {
        if (categories[i].id === $scope.report.category.id)
        {
          return $scope.category = categories[i];
        }

        if (categories[i].subcategories.length !== 0)
        {
          for (var j = categories[i].subcategories.length - 1; j >= 0; j--) {
            if (categories[i].subcategories[j].id === $scope.report.category.id)
            {
              return $scope.category = categories[i].subcategories[j];
            }
          };
        }
      }
    };

    findCategory();

    $scope.images = [];

    for (var c = $scope.report.images.length - 1; c >= 0; c--) {
      $scope.images.push({versions: $scope.report.images[c]});
    };

    $scope.newUserResponse = { message: null, privateComment: false, typing: false };
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
      });
    };

    $scope.submitSystemComment = function() {
      $scope.processingSystemComment = true;

      var postCommentResponse = sendComment($scope.newSystemComment.message, 2);

      postCommentResponse.then(function(response) {
        $scope.processingSystemComment = false;
        $scope.newSystemComment.message = null;

        $scope.comments.push(response.data);
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
            return $scope.category;
          },

          categories: function() {
            return Restangular.all('reports').all('categories').getList({'display_type': 'full'});
          }
        },
        controller: 'ReportsEditCategoryModalController'
      });
    };

    $scope.editReportStatus = function (report, category) {
      $modal.open({
        templateUrl: 'modals/reports/edit-status/reports-edit-status.template.html',
        windowClass: 'editStatusModal',
        resolve: {
          report: function() {
            return report;
          },

          category: function() {
            return category;
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
            return $scope.category;
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
          }
        },
        controller: 'ReportsEditDescriptionModalController'
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
            return $scope.category;
          },

          groupsResponse: function() {
            return Restangular.all('groups').getList();
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

              var changeStatusPromise = Restangular.one('reports', $scope.category.id).one('items', $scope.report.id).one('assign').customPUT({ 'user_id': user.id });

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

    // item history
    $scope.refreshHistory = function() {
      var options = {}, selectedFilters = $scope.selectedFilters();

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
      { type: 'category', name: 'Categoria', selected: true },
      { type: 'status', name: 'Estados', selected: true },
      { type: 'overdue', name: 'Em atraso', selected: true }
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

    $scope.historyLogs = reportHistoryResponse.data;
  });
