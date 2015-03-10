'use strict';

angular
  .module('ReportsShowControllerModule', [
    'MapShowReportComponentModule',
    'ReportsEditStatusModalControllerModule',
    'ReportsEditDescriptionModalControllerModule',
    'ReportsEditCategoryModalControllerModule',
    'ReportsSelectAddressModalControllerModule',
    'duScroll'
  ])

  .value('duScrollOffset', 200)

  .controller('ReportsShowController', function ($scope, Restangular, $q, $modal, reportResponse, feedbackResponse, categoriesResponse, commentsResponse, $rootScope) {
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
  });
